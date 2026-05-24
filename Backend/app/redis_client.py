import redis
import os

from dotenv import load_dotenv

load_dotenv()

REDIS_HOST = os.getenv(
    "REDIS_HOST",
    "redis"
)

REDIS_PORT = os.getenv(
    "REDIS_PORT",
    6379
)

redis_client = redis.Redis(
    host=REDIS_HOST,
    port=int(REDIS_PORT),
    db=0,
    decode_responses=True
)

print("REDIS CONNECTED")