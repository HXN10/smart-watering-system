# Database Storage Location

## Docker Setup (Current Configuration)

When using `docker-compose.yml`, MongoDB data is stored in a Docker volume.

**Volume Name:** `mongo-data`  
**Container Path:** `/data/db`  
**Host Location:** Docker managed volume

### Finding the Exact Location

```bash
docker volume inspect smart-watering-system_mongo-data
```

This will show the `Mountpoint` which is the actual directory on your host system where data is stored.

Typically on macOS, Docker volumes are stored at:
```
~/Library/Containers/com.docker.docker/Data/vms/0/data/docker/volumes/
```

### Data Persistence

- Data persists when container stops
- Data persists when container is removed (unless volume is deleted)
- To remove data: `docker volume rm smart-watering-system_mongo-data`

## Local MongoDB Installation

If MongoDB is installed locally (not Docker):

**macOS (Homebrew):**
```
/opt/homebrew/var/mongodb
```

**Linux:**
```
/var/lib/mongodb
```

**Windows:**
```
C:\Program Files\MongoDB\Server\{version}\data
```

### Finding Your MongoDB Data Path

Check MongoDB configuration:
```bash
mongosh --eval "db.serverCmdLineOpts().parsed.storage.dbPath"
```

Or check config file:
```bash
cat /usr/local/etc/mongod.conf  # macOS Homebrew
cat /etc/mongod.conf            # Linux
```

## Database Name

The application uses database: `watering`

Collections:
- `users` - User accounts
- `plants` - Plant data with sensor readings

## Backup

### Docker Volume Backup

```bash
# Create backup
docker run --rm -v smart-watering-system_mongo-data:/data -v $(pwd):/backup \
  mongo:6.0 mongodump --out=/backup/mongodb-backup

# Restore backup
docker run --rm -v smart-watering-system_mongo-data:/data -v $(pwd):/backup \
  mongo:6.0 mongorestore /backup/mongodb-backup
```

### Direct MongoDB Backup

```bash
mongodump --uri="mongodb://localhost:27017/watering" --out=./backup
mongorestore --uri="mongodb://localhost:27017/watering" ./backup/watering
```

