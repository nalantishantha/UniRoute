/**
 * WebRTC utility hook for peer-to-peer video calling
 * Handles WebRTC connection, signaling, and media streams
 */
import { useState, useEffect, useRef, useCallback } from 'react';

// Free STUN servers (for NAT traversal)
const ICE_SERVERS = {
    iceServers: [
        { urls: 'stun:stun.l.google.com:19302' },
        { urls: 'stun:stun1.l.google.com:19302' },
        { urls: 'stun:stun2.l.google.com:19302' },
        { urls: 'stun:stun3.l.google.com:19302' },
        { urls: 'stun:stun4.l.google.com:19302' },
    ]
};

export const useWebRTC = (roomId, userId, userRole, websocketUrl) => {
    const [localStream, setLocalStream] = useState(null);
    const [remoteStream, setRemoteStream] = useState(null);
    const [isConnected, setIsConnected] = useState(false);
    const [isConnecting, setIsConnecting] = useState(false);
    const [error, setError] = useState(null);
    const [connectionState, setConnectionState] = useState('new');
    const [remoteUser, setRemoteUser] = useState(null);

    const peerConnectionRef = useRef(null);
    const websocketRef = useRef(null);
    const localStreamRef = useRef(null);
    const remoteStreamRef = useRef(null);
    const iceCandidatesQueue = useRef([]);
    const isConnectingRef = useRef(false); // Prevent duplicate connections

    // Initialize local media stream
    const initializeLocalStream = useCallback(async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                video: {
                    width: { ideal: 1280 },
                    height: { ideal: 720 },
                    facingMode: 'user'
                },
                audio: {
                    echoCancellation: true,
                    noiseSuppression: true,
                    autoGainControl: true
                }
            });

            localStreamRef.current = stream;
            setLocalStream(stream);
            return stream;
        } catch (err) {
            console.error('Error accessing media devices:', err);
            setError('Failed to access camera/microphone. Please check permissions.');
            throw err;
        }
    }, []);

    // Create peer connection
    const createPeerConnection = useCallback(() => {
        const peerConnection = new RTCPeerConnection(ICE_SERVERS);

        // Add local stream tracks to peer connection
        if (localStreamRef.current) {
            localStreamRef.current.getTracks().forEach(track => {
                peerConnection.addTrack(track, localStreamRef.current);
            });
        }

        // Handle incoming tracks (remote stream)
        peerConnection.ontrack = (event) => {
            console.log('Received remote track:', event.track.kind);

            if (!remoteStreamRef.current) {
                remoteStreamRef.current = new MediaStream();
                setRemoteStream(remoteStreamRef.current);
            }

            remoteStreamRef.current.addTrack(event.track);
        };

        // Handle ICE candidates
        peerConnection.onicecandidate = (event) => {
            if (event.candidate && websocketRef.current?.readyState === WebSocket.OPEN) {
                websocketRef.current.send(JSON.stringify({
                    type: 'ice-candidate',
                    candidate: event.candidate,
                    sender_id: userId,
                    sender_role: userRole
                }));
            }
        };

        // Monitor connection state
        peerConnection.onconnectionstatechange = () => {
            console.log('Connection state:', peerConnection.connectionState);
            setConnectionState(peerConnection.connectionState);

            if (peerConnection.connectionState === 'connected') {
                setIsConnected(true);
                setIsConnecting(false);
            } else if (peerConnection.connectionState === 'failed' ||
                peerConnection.connectionState === 'disconnected') {
                setIsConnected(false);
                setIsConnecting(false);
            } else if (peerConnection.connectionState === 'connecting') {
                setIsConnecting(true);
            }
        };

        // Monitor ICE connection state
        peerConnection.oniceconnectionstatechange = () => {
            console.log('ICE connection state:', peerConnection.iceConnectionState);
        };

        peerConnectionRef.current = peerConnection;
        return peerConnection;
    }, [userId, userRole]);

    // Create and send offer
    const createOffer = useCallback(async () => {
        try {
            console.log('📞 createOffer called, creating peer connection...');
            if (!peerConnectionRef.current) {
                createPeerConnection();
            }

            console.log('📝 Creating WebRTC offer...');
            const offer = await peerConnectionRef.current.createOffer({
                offerToReceiveAudio: true,
                offerToReceiveVideo: true
            });

            await peerConnectionRef.current.setLocalDescription(offer);
            console.log('✅ Offer created and set as local description');

            if (websocketRef.current?.readyState === WebSocket.OPEN) {
                console.log('📤 Sending offer via WebSocket...');
                websocketRef.current.send(JSON.stringify({
                    type: 'offer',
                    offer: offer,
                    sender_id: userId,
                    sender_role: userRole
                }));
                console.log('✅ Offer sent successfully');
            } else {
                console.error('❌ WebSocket not open, cannot send offer. State:', websocketRef.current?.readyState);
            }
        } catch (err) {
            console.error('Error creating offer:', err);
            setError('Failed to create connection offer');
        }
    }, [createPeerConnection, userId, userRole]);

    // Handle incoming offer
    const handleOffer = useCallback(async (offer, senderId, senderRole) => {
        try {
            console.log('📨 Received offer from:', senderRole, senderId);
            if (!peerConnectionRef.current) {
                console.log('Creating new peer connection...');
                createPeerConnection();
            }

            console.log('Setting remote description (offer)...');
            await peerConnectionRef.current.setRemoteDescription(new RTCSessionDescription(offer));

            // Process queued ICE candidates
            console.log('Processing', iceCandidatesQueue.current.length, 'queued ICE candidates');
            while (iceCandidatesQueue.current.length > 0) {
                const candidate = iceCandidatesQueue.current.shift();
                await peerConnectionRef.current.addIceCandidate(new RTCIceCandidate(candidate));
            }

            console.log('Creating answer...');
            const answer = await peerConnectionRef.current.createAnswer();
            await peerConnectionRef.current.setLocalDescription(answer);
            console.log('✅ Answer created and set as local description');

            if (websocketRef.current?.readyState === WebSocket.OPEN) {
                console.log('📤 Sending answer via WebSocket...');
                websocketRef.current.send(JSON.stringify({
                    type: 'answer',
                    answer: answer,
                    sender_id: userId,
                    sender_role: userRole
                }));
                console.log('✅ Answer sent successfully');
            }

            setRemoteUser({ id: senderId, role: senderRole });
        } catch (err) {
            console.error('Error handling offer:', err);
            setError('Failed to handle connection offer');
        }
    }, [createPeerConnection, userId, userRole]);

    // Handle incoming answer
    const handleAnswer = useCallback(async (answer, senderId, senderRole) => {
        try {
            console.log('📨 Received answer from:', senderRole, senderId);
            if (peerConnectionRef.current) {
                console.log('Setting remote description (answer)...');
                await peerConnectionRef.current.setRemoteDescription(new RTCSessionDescription(answer));
                console.log('✅ Remote description set successfully');

                // Process queued ICE candidates
                console.log('Processing', iceCandidatesQueue.current.length, 'queued ICE candidates');
                while (iceCandidatesQueue.current.length > 0) {
                    const candidate = iceCandidatesQueue.current.shift();
                    await peerConnectionRef.current.addIceCandidate(new RTCIceCandidate(candidate));
                }

                setRemoteUser({ id: senderId, role: senderRole });
            } else {
                console.error('❌ No peer connection to handle answer');
            }
        } catch (err) {
            console.error('Error handling answer:', err);
            setError('Failed to handle connection answer');
        }
    }, []);

    // Handle incoming ICE candidate
    const handleIceCandidate = useCallback(async (candidate) => {
        try {
            if (peerConnectionRef.current && peerConnectionRef.current.remoteDescription) {
                await peerConnectionRef.current.addIceCandidate(new RTCIceCandidate(candidate));
            } else {
                // Queue candidates if remote description not set yet
                iceCandidatesQueue.current.push(candidate);
            }
        } catch (err) {
            console.error('Error handling ICE candidate:', err);
        }
    }, []);

    // Initialize WebSocket connection
    const initializeWebSocket = useCallback(() => {
        const ws = new WebSocket(websocketUrl);

        ws.onopen = () => {
            console.log('WebSocket connected');

            // Mark as connected
            setIsConnected(true);
            setIsConnecting(false);
            isConnectingRef.current = false;

            // Join the room
            ws.send(JSON.stringify({
                type: 'join',
                user_id: userId,
                role: userRole
            }));
        };

        ws.onmessage = async (event) => {
            const data = JSON.parse(event.data);
            console.log('WebSocket message:', data.type);

            switch (data.type) {
                case 'user_connected':
                    console.log('Successfully connected to room');
                    // This is sent when we first connect
                    break;

                case 'user_joined':
                    console.log('User joined:', data.role, data.user_id, 'Participant count:', data.participant_count);
                    // Update remote user info
                    setRemoteUser({
                        user_id: data.user_id,
                        role: data.role
                    });
                    // If we're the mentor and now there are 2 participants, create offer
                    if (data.participant_count === 2 && userRole === 'mentor') {
                        console.log('🎬 Mentor creating offer for participant count:', data.participant_count);
                        setTimeout(() => {
                            console.log('⏰ Executing delayed createOffer');
                            createOffer();
                        }, 1000);
                    } else {
                        console.log('Not creating offer. Role:', userRole, 'Count:', data.participant_count);
                    }
                    break;

                case 'offer':
                    await handleOffer(data.offer, data.sender_id, data.sender_role);
                    break;

                case 'answer':
                    await handleAnswer(data.answer, data.sender_id, data.sender_role);
                    break;

                case 'ice-candidate':
                    await handleIceCandidate(data.candidate);
                    break;

                case 'user_left':
                case 'user_disconnected':
                    console.log('User left:', data.role || 'unknown', data.user_id || 'unknown');
                    setRemoteUser(null);
                    if (remoteStreamRef.current) {
                        remoteStreamRef.current.getTracks().forEach(track => track.stop());
                        remoteStreamRef.current = null;
                        setRemoteStream(null);
                    }
                    break;

                case 'error':
                    console.error('WebSocket error:', data.message);
                    setError(data.message);
                    break;

                default:
                    console.log('Unknown message type:', data.type);
            }
        };

        ws.onerror = (error) => {
            console.error('WebSocket error:', error);
            setError('WebSocket connection error');
            setIsConnecting(false);
            isConnectingRef.current = false;
        };

        ws.onclose = () => {
            console.log('WebSocket disconnected');
            setIsConnected(false);
            setIsConnecting(false);
            isConnectingRef.current = false;
        };

        websocketRef.current = ws;
        return ws;
    }, [websocketUrl, userId, userRole, createOffer, handleOffer, handleAnswer, handleIceCandidate]);

    // Connect to room
    const connect = useCallback(async () => {
        // Prevent duplicate connections
        if (isConnectingRef.current || websocketRef.current) {
            console.log('Already connecting or connected, skipping...');
            return;
        }

        try {
            isConnectingRef.current = true;
            setError(null);
            setIsConnecting(true);

            // Initialize local stream
            await initializeLocalStream();

            // Create peer connection
            createPeerConnection();

            // Initialize WebSocket
            initializeWebSocket();

        } catch (err) {
            console.error('Error connecting:', err);
            setError('Failed to connect to video call');
            setIsConnecting(false);
            isConnectingRef.current = false;
        }
    }, [initializeLocalStream, createPeerConnection, initializeWebSocket]);

    // Disconnect from room
    const disconnect = useCallback(() => {
        // Send leave message
        if (websocketRef.current?.readyState === WebSocket.OPEN) {
            websocketRef.current.send(JSON.stringify({
                type: 'leave',
                user_id: userId,
                role: userRole
            }));
        }

        // Close WebSocket
        if (websocketRef.current) {
            websocketRef.current.close();
            websocketRef.current = null;
        }

        // Close peer connection
        if (peerConnectionRef.current) {
            peerConnectionRef.current.close();
            peerConnectionRef.current = null;
        }

        // Stop local stream
        if (localStreamRef.current) {
            localStreamRef.current.getTracks().forEach(track => track.stop());
            localStreamRef.current = null;
            setLocalStream(null);
        }

        // Stop remote stream
        if (remoteStreamRef.current) {
            remoteStreamRef.current.getTracks().forEach(track => track.stop());
            remoteStreamRef.current = null;
            setRemoteStream(null);
        }

        setIsConnected(false);
        setIsConnecting(false);
        setRemoteUser(null);
        isConnectingRef.current = false; // Reset connection flag
    }, [userId, userRole]);

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            disconnect();
        };
    }, [disconnect]);

    return {
        localStream,
        remoteStream,
        isConnected,
        isConnecting,
        error,
        connectionState,
        remoteUser,
        connect,
        disconnect
    };
};

export default useWebRTC;
