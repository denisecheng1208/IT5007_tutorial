# IT5007_tutorial

This is for NUS school of computing course IT5007

### Project Set Up

```
nvm install 10
nvm alias default 10
node --version
npm --version
npm install -g npm@6
npm install
```

### Set up mongodb
```
apt install gnupg
curl -fsSL https://www.mongodb.org/static/pgp/server-4.4.asc | apt-key add -
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu bionic/mongodb-org/4.4 multiverse" | tee /etc/apt/sources.list.d/mongodb-org-4.4.list
apt update
apt install mongodb-org
mkdir -p /data/db
screen mongod

mongo travellertracker --eval "db.employees.remove({})" 
node scripts/trymongo.js
mongo travellertracker scripts/init.mongo.js
```

### JSX Transform
```
npm install --save-dev @babel/core@7 @babel/cli@7
node_modules/.bin/babel --version
npx babel --version
npm install --save-dev @babel/preset-react@7
npx babel src --presets @babel/react --out-dir public
```
### Express
```
node server.js
npm start

