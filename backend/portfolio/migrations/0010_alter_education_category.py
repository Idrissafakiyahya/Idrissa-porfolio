from django.db import migrations, models


def normalize_education_categories(apps, schema_editor):
    Education = apps.get_model('portfolio', 'Education')
    Education.objects.filter(category='event').update(category='events')


class Migration(migrations.Migration):

    dependencies = [
        ('portfolio', '0009_alter_project_cover_image'),
    ]

    operations = [
        migrations.RunPython(normalize_education_categories, migrations.RunPython.noop),
        migrations.AlterField(
            model_name='education',
            name='category',
            field=models.CharField(
                choices=[('education', 'Education'), ('certificates', 'Certificates'), ('events', 'Events')],
                default='education',
                max_length=20,
            ),
        ),
    ]
