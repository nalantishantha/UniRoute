# Generated manually to add mentor foreign key relationship

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('pre_mentors', '0002_add_application_fields'),
        ('mentoring', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='prementors',
            name='mentor',
            field=models.ForeignKey(
                blank=True, 
                null=True, 
                on_delete=django.db.models.deletion.SET_NULL, 
                to='mentoring.mentors',
                help_text='Reference to associated mentor record'
            ),
        ),
    ]