def write_file(data, filename):
    with open(filename, 'wb') as f:
        f.write(data)

def read_file(filename):
    with open(filename, 'rb') as f:
        data = f.read()
    return data