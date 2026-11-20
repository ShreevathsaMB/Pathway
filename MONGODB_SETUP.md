# MongoDB Installation Guide for Windows

## Option 1: MongoDB Community Edition (Local Installation)

### Step 1: Download MongoDB
1. Visit: https://www.mongodb.com/try/download/community
2. Select:
   - Version: Latest (7.0 or higher)
   - Platform: Windows
   - Package: MSI
3. Click "Download"

### Step 2: Install MongoDB
1. Run the downloaded `.msi` file
2. Choose "Complete" installation
3. **Important**: Check "Install MongoDB as a Service"
4. **Important**: Check "Install MongoDB Compass" (GUI tool)
5. Click "Next" and complete installation

### Step 3: Verify Installation
Open PowerShell and run:
```powershell
mongod --version
```

You should see version information.

### Step 4: Start MongoDB Service
MongoDB should start automatically as a service. To verify:
```powershell
# Check if MongoDB service is running
Get-Service -Name MongoDB
```

If not running, start it:
```powershell
# Start MongoDB service
Start-Service -Name MongoDB
```

### Step 5: Test Connection
```powershell
# Connect to MongoDB shell
mongosh
```

You should see a MongoDB shell prompt. Type `exit` to quit.

---

## Option 2: MongoDB Atlas (Cloud - Recommended for Beginners)

### Step 1: Create Account
1. Visit: https://www.mongodb.com/cloud/atlas/register
2. Sign up for free account
3. Verify your email

### Step 2: Create Free Cluster
1. Click "Build a Database"
2. Choose "FREE" tier (M0)
3. Select cloud provider (AWS recommended)
4. Choose region closest to you (Mumbai for India)
5. Click "Create Cluster"

### Step 3: Create Database User
1. Go to "Database Access" in left menu
2. Click "Add New Database User"
3. Choose "Password" authentication
4. Username: `pathway_admin`
5. Password: Create a strong password (save it!)
6. Database User Privileges: "Atlas admin"
7. Click "Add User"

### Step 4: Whitelist IP Address
1. Go to "Network Access" in left menu
2. Click "Add IP Address"
3. Click "Allow Access from Anywhere" (for development)
4. Click "Confirm"

### Step 5: Get Connection String
1. Go to "Database" in left menu
2. Click "Connect" on your cluster
3. Choose "Connect your application"
4. Copy the connection string (looks like):
   ```
   mongodb+srv://pathway_admin:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```
5. Replace `<password>` with your actual password

---

## For Pathway Project

### If using Local MongoDB:
Your connection string will be:
```
mongodb://localhost:27017/pathway
```

### If using MongoDB Atlas:
Your connection string will be:
```
mongodb+srv://pathway_admin:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/pathway?retryWrites=true&w=majority
```

---

## Next Steps

1. Choose your preferred option (Local or Atlas)
2. Complete the setup
3. Save your connection string
4. We'll add it to the Django `.env` file

**Recommendation**: Use MongoDB Atlas for easier setup and no local installation required!
