from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('accounts', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='AdminReportRecord',
            fields=[
                ('report_id', models.AutoField(primary_key=True, serialize=False)),
                ('title', models.CharField(max_length=255)),
                ('start_date', models.DateField()),
                ('end_date', models.DateField()),
                ('file_path', models.CharField(max_length=255)),
                ('file_size', models.PositiveIntegerField(default=0)),
                ('data_snapshot', models.JSONField()),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('requested_by', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='generated_admin_reports', to='accounts.users')),
            ],
            options={
                'db_table': 'admin_reports',
                'ordering': ['-created_at'],
            },
        ),
    ]
