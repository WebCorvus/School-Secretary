# DEPRECATED - Use seed_data command instead

⚠️ **This seed command is DEPRECATED and will cause errors.**

The models have been updated to require a `user` field for Student, Professor, and Guardian models, but this old seed command does not create User objects.

## Migration Path

Use the new `seed_data` command instead:

```bash
# For complete test data with user credentials
python manage.py seed_data example

# For basic school structure without students
python manage.py seed_data fast-use

# To reset the database
python manage.py seed_data factory
```

See `/api/SEED_COMMAND_README.md` for detailed documentation.

## Why was this command deprecated?

The recent updates added a `user` OneToOneField to:
- `Student` model
- `Professor` model  
- `Guardian` model

This command creates these objects without creating the corresponding User objects, which will cause database integrity errors.

The new `seed_data` command properly creates User objects for all profiles.
