const mongoose = require('mongoose');
const uri = 'mongodb+srv://shubhamsingh22485:21worker@cluster0.2nwntor.mongodb.net/worker-management-system?retryWrites=true&w=majority&appName=Cluster0';

async function test() {
  await mongoose.connect(uri);
  
  const site = await mongoose.connection.db.collection('sites').findOne({ isDeleted: false, status: 'ACTIVE' });
  console.log('Site:', site.siteName, site._id);
  
  const workers = await mongoose.connection.db.collection('workers').find({ isDeleted: false, site: null, status: 'ACTIVE' }).limit(2).toArray();
  console.log('Workers to assign:', workers.map(w => w.fullName));
  
  const workerIds = workers.map(w => w._id);
  const result = await mongoose.connection.db.collection('workers').updateMany(
    { _id: { $in: workerIds } },
    { $set: { site: site._id } }
  );
  console.log('Assignment result:', result);
  
  const updated = await mongoose.connection.db.collection('workers').find({ _id: { $in: workerIds } }).toArray();
  console.log('Updated workers:', updated.map(w => ({ name: w.fullName, site: w.site })));
  
  // Also update site.workers array
  const siteResult = await mongoose.connection.db.collection('sites').findOneAndUpdate(
    { _id: site._id },
    { $addToSet: { workers: { $each: workerIds } } },
    { returnDocument: 'after' }
  );
  console.log('Site updated workers count:', siteResult.value.workers?.length || 0);
  
  await mongoose.disconnect();
}

test().catch(err => console.error(err));
