import random
import string


def generate_album_code(length=8):
    characters = string.ascii_uppercase + string.digits

    return "".join(
        random.choice(characters)
        for _ in range(length)
    )