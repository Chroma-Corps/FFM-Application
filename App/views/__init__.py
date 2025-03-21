# Blueprints Are Imported Explicitly Instead Of Using *
from .user import user_views
from .index import index_views
from .auth import auth_views
from .admin import setup_admin
from .budget import budget_views
from .goal import goal_views
from .transaction import transaction_views
from .bank import bank_views
from .static import static_views

# Blueprints Are Then Added To This List!
views = [
        user_views,
        index_views,
        auth_views,
        budget_views,
        goal_views,
        transaction_views,
        bank_views,
        static_views
    ]