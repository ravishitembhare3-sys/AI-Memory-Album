import cv2
import numpy as np


def generate_descriptor(image_path):
    image = cv2.imread(image_path)

    if image is None:
        return None

    gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)

    orb = cv2.ORB_create(nfeatures=1000)

    keypoints, descriptors = orb.detectAndCompute(gray, None)

    if descriptors is None:
        return None

    return descriptors


def save_descriptor(image_path, descriptor_path):
    descriptor = generate_descriptor(image_path)

    if descriptor is None:
        return False

    np.save(descriptor_path, descriptor)

    return True