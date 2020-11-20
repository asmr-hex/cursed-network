import socket
import sys
import os

from utils.logging import init_logger


logger = init_logger(__name__, True)

SOCKETFILE = './.socket'

# ensure socket file doesn't already exist
try:
    os.unlink(SOCKETFILE)
except OSError:
    if os.path.exists(SOCKETFILE):
        raise

# create socket
sock = socket.socket(socket.AF_UNIX, socket.SOCK_STREAM)

# bind the socket to the port
sock.bind(SOCKETFILE)

# listen
sock.listen(1)
logger.info(f'listening to Unix socket {SOCKETFILE}')
while True:
    # wait for a connection
    connection, client_addr = sock.accept()
    try:
        logger.info(f"connection from {connection}")

        # receive data in small chunks
        while True:
            data = connection.recv(16)
            logger.info(f"received {data}")
    finally:
        logger.info('closing connection')
        connection.close()
