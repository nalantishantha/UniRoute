from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('university_programs', '0001_initial'),
        ('universities', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='degreeprograms',
            name='faculty',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.DO_NOTHING, to='universities.faculties'),
        ),
    ]
