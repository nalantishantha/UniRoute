# Generated manually for mentor application system

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('pre_mentors', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='prementors',
            name='applied',
            field=models.IntegerField(default=0, help_text='0=not applied, 1=applied'),
        ),
        migrations.AddField(
            model_name='prementors',
            name='recommendation',
            field=models.TextField(blank=True, null=True, help_text='Recommendation text from application form'),
        ),
        migrations.AddField(
            model_name='prementors',
            name='skills',
            field=models.TextField(blank=True, null=True, help_text='Skills and expertise from application form'),
        ),
        migrations.AddField(
            model_name='prementors',
            name='nic_photo',
            field=models.CharField(max_length=255, blank=True, null=True, help_text='Path to NIC photo file'),
        ),
        migrations.AddField(
            model_name='prementors',
            name='student_id_photo',
            field=models.CharField(max_length=255, blank=True, null=True, help_text='Path to Student ID photo file'),
        ),
        migrations.AddField(
            model_name='prementors',
            name='recommendation_letter',
            field=models.CharField(max_length=255, blank=True, null=True, help_text='Path to recommendation letter file'),
        ),
        migrations.AddField(
            model_name='prementors',
            name='application_date',
            field=models.DateTimeField(blank=True, null=True, help_text='Date when application was submitted'),
        ),
    ]