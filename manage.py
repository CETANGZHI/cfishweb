import os
from flask_script import Manager
from flask_migrate import Migrate, MigrateCommand
from src.main import app
from src.models import db

# Initialize Flask-Migrate
migrate = Migrate(app, db)

# Initialize Flask-Script Manager
manager = Manager(app)

# Add the migrate command to the manager
manager.add_command("db", MigrateCommand)

if __name__ == "__main__":
    manager.run()


