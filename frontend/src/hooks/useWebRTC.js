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
            if (!peerConnectionRef.current) {
                createPeerConnection();
            }

            const offer = await peerConnectionRef.current.createOffer({
                offerToReceiveAudio: true,
                offerToReceiveVideo: true
            });

            await peerConnectionRef.current.setLocalDescription(offer);

            if (websocketRef.current?.readyState === WebSocket.OPEN) {
                websocketRef.current.send(JSON.stringify({
                    type: 'offer',
                    offer: offer,
                    sender_id: userId,
                    sender_role: userRole
                }));
            }
        } catch (err) {
            console.error('Error creating offer:', err);
            setError('Failed to create connection offer');
        }
    }, [createPeerConnection, userId, userRole]);

    // Handle incoming offer
    const handleOffer = useCallback(async (offer, senderId, senderRole) => {
        try {
            if (!peerConnectionRef.current) {
                createPeerConnection();
            }

            await peerConnectionRef.current.setRemoteDescription(new RTCSessionDescription(offer));

            // Process queued ICE candidates
            while (iceCandidatesQueue.current.length > 0) {
                const candidate = iceCandidatesQueue.current.shift();
                await peerConnectionRef.current.addIceCandidate(new RTCIceCandidate(candidate));
            }

            const answer = await peerConnectionRef.current.createAnswer();
            await peerConnectionRef.current.setLocalDescription(answer);

            if (websocketRef.current?.readyState === WebSocket.OPEN) {
                websocketRef.current.send(JSON.stringify({
                    type: 'answer',
                    answer: answer,
                    sender_id: userId,
                    sender_role: userRole
                }));
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
            if (peerConnectionRef.current) {
                await peerConnectionRef.current.setRemoteDescription(new RTCSessionDescription(answer));

                // Process queued ICE candidates
                while (iceCandidatesQueue.current.length > 0) {
                    const candidate = iceCandidatesQueue.current.shift();
                    await peerConnectionRef.current.addIceCandidate(new RTCIceCandidate(candidate));
                }

                setRemoteUser({ id: senderId, role: senderRole });
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
                case 'user_joined':
                    console.log('User joined:', data.role, data.user_id);
                    // If we're the first user and someone joins, create offer
                    if (data.participant_count === 2 && userRole === 'mentor') {
                        setTimeout(() => createOffer(), 1000);
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
                    console.log('User left:', data.role, data.user_id);
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
        };

        ws.onclose = () => {
            console.log('WebSocket disconnected');
            setIsConnected(false);
        };

        websocketRef.current = ws;
        return ws;
    }, [websocketUrl, userId, userRole, createOffer, handleOffer, handleAnswer, handleIceCandidate]);

    // Connect to room
    const connect = useCallback(async () => {
        try {
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
