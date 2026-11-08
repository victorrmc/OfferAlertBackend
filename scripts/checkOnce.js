// Runs a single offer check and exits. Used by the scheduled GitHub Action,
// so the check runs even while the free web server is asleep.
import { connectDB, mongoose } from '../config/database.js';
import { checkForOffers } from '../services/offerChecker.js';

await connectDB();
try {
    await checkForOffers();
} finally {
    await mongoose.disconnect();
}
