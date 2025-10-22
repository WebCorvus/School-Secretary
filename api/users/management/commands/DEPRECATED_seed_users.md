# DEPRECATED - Use seed_data command instead

⚠️ **This seed command is DEPRECATED.**

The new unified `seed_data` command provides better functionality with three modes:

```bash
# For complete test data with user credentials (replaces seed_users functionality)
python manage.py seed_data example

# For basic school structure
python manage.py seed_data fast-use

# To reset the database
python manage.py seed_data factory
```

See `/api/SEED_COMMAND_README.md` for detailed documentation.

## Why was this command deprecated?

The `seed_data` command provides:
1. Unified seeding experience
2. Three different modes for different use cases
3. Proper User object creation for all profiles
4. Better test credential display
5. Comprehensive data generation across all models
