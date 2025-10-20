from django.db.models.signals import post_save, pre_save
from django.dispatch import receiver
from django.utils import timezone
from .models import Mentors
from apps.pre_mentors.models import PreMentors, PreMentorAvailability, PreMentorSessions, PreMentorEarnings
import logging

logger = logging.getLogger(__name__)

@receiver(pre_save, sender=Mentors)
def capture_mentor_approval_change(sender, instance, **kwargs):
    """Capture the previous approval status before saving"""
    if instance.pk:  # Only for existing instances
        try:
            old_instance = Mentors.objects.get(pk=instance.pk)
            instance._old_approved = old_instance.approved
        except Mentors.DoesNotExist:
            instance._old_approved = None
    else:
        instance._old_approved = None

@receiver(post_save, sender=Mentors)
def handle_mentor_approval(sender, instance, created, **kwargs):
    """
    Handle mentor approval - remove pre-mentor data when approved status changes from 0 to 1
    """
    try:
        # Check if this is an approval change (from 0 to 1)
        old_approved = getattr(instance, '_old_approved', None)
        current_approved = instance.approved
        
        # If mentor was just approved (changed from 0 to 1)
        if old_approved == 0 and current_approved == 1:
            logger.info(f"Mentor {instance.mentor_id} approved. Removing pre-mentor data for user {instance.user_id}")
            
            # Find and remove pre-mentor data
            try:
                pre_mentor = PreMentors.objects.get(user_id=instance.user_id)
                
                # Store pre-mentor info for logging
                pre_mentor_id = pre_mentor.pre_mentor_id
                total_sessions = pre_mentor.total_sessions
                total_earnings = pre_mentor.total_earnings
                
                # Delete related pre-mentor data
                # 1. Delete availability records
                availability_count = PreMentorAvailability.objects.filter(pre_mentor=pre_mentor).count()
                PreMentorAvailability.objects.filter(pre_mentor=pre_mentor).delete()
                
                # 2. Delete session records (keep for history if needed, or delete)
                sessions_count = PreMentorSessions.objects.filter(pre_mentor=pre_mentor).count()
                # Uncomment the next line if you want to delete session history
                # PreMentorSessions.objects.filter(pre_mentor=pre_mentor).delete()
                
                # 3. Delete earnings records (keep for history if needed, or delete)
                earnings_count = PreMentorEarnings.objects.filter(pre_mentor=pre_mentor).count()
                # Uncomment the next line if you want to delete earnings history
                # PreMentorEarnings.objects.filter(pre_mentor=pre_mentor).delete()
                
                # 4. Finally delete the pre-mentor record
                pre_mentor.delete()
                
                # Log the successful removal
                logger.info(f"Successfully removed pre-mentor data:")
                logger.info(f"  - Pre-mentor ID: {pre_mentor_id}")
                logger.info(f"  - User ID: {instance.user_id}")
                logger.info(f"  - Deleted {availability_count} availability records")
                logger.info(f"  - Found {sessions_count} session records")
                logger.info(f"  - Found {earnings_count} earnings records")
                logger.info(f"  - Total sessions completed as pre-mentor: {total_sessions}")
                logger.info(f"  - Total earnings as pre-mentor: ${total_earnings}")
                
                # Optional: Update mentor record with pre-mentor experience
                if total_sessions > 0:
                    # Add pre-mentor experience to mentor bio
                    experience_text = f"\n\nPrevious Pre-Mentor Experience: {total_sessions} sessions completed with total earnings of ${total_earnings}."
                    if instance.bio:
                        instance.bio += experience_text
                    else:
                        instance.bio = f"Experienced tutor promoted from pre-mentor status.{experience_text}"
                    
                    # Save without triggering signals again
                    Mentors.objects.filter(pk=instance.pk).update(bio=instance.bio)
                
            except PreMentors.DoesNotExist:
                logger.warning(f"No pre-mentor found for user {instance.user_id} when mentor was approved")
                
    except Exception as e:
        logger.error(f"Error handling mentor approval for mentor {instance.mentor_id}: {str(e)}")

@receiver(post_save, sender=Mentors)
def log_mentor_status_changes(sender, instance, created, **kwargs):
    """Log all mentor status changes for auditing"""
    if created:
        logger.info(f"New mentor application created: ID {instance.mentor_id}, User {instance.user_id}, Status: {'Approved' if instance.approved == 1 else 'Pending'}")
    else:
        old_approved = getattr(instance, '_old_approved', None)
        if old_approved is not None and old_approved != instance.approved:
            status_change = f"{'Pending' if old_approved == 0 else 'Approved'} -> {'Approved' if instance.approved == 1 else 'Pending'}"
            logger.info(f"Mentor status changed: ID {instance.mentor_id}, User {instance.user_id}, Change: {status_change}")