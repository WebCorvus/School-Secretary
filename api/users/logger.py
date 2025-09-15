import threading
from collections import deque

class UserActionLogger:
    """
    Logger para registrar as últimas ações de cada usuário simulado.
    """
    _logs = {}
    _lock = threading.Lock()
    _max_actions = 5

    @classmethod
    def log_action(cls, user_id, action, data=None, response=None, error=None):
        with cls._lock:
            if user_id not in cls._logs:
                cls._logs[user_id] = deque(maxlen=cls._max_actions)
            cls._logs[user_id].append({
                'action': action,
                'data': data,
                'response': response,
                'error': error
            })

    @classmethod
    def get_last_actions(cls, user_id):
        with cls._lock:
            return list(cls._logs.get(user_id, []))

    @classmethod
    def clear(cls):
        with cls._lock:
            cls._logs.clear()
