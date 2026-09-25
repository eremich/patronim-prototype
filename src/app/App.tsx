import { BrowserRouter, Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { Shell } from './Shell';
import { Today } from '../screens/manager/Today';
import { Book } from '../screens/manager/Book';
import { Review } from '../screens/manager/Review';
import { Confirmed } from '../screens/manager/Confirmed';
import { Tracking } from '../screens/manager/Tracking';
import { Rate } from '../screens/manager/Rate';
import { Account, Bookings, Properties } from '../screens/manager/ManagerTabs';
import { Jobs } from '../screens/patron/Jobs';
import { JobDetail } from '../screens/patron/JobDetail';
import { Checklist } from '../screens/patron/Checklist';
import { Earnings, Messages, PatronProfile } from '../screens/patron/PatronTabs';
import { Queue } from '../screens/inspector/Queue';
import { Inspection } from '../screens/inspector/Inspection';
import { History, InspectorProfile, MapScreen } from '../screens/inspector/InspectorTabs';

/** "/" keeps the query (?role=&scenario=) so the Shell can read it before redirecting */
const Home = () => {
  const { search } = useLocation();
  const role = new URLSearchParams(search).get('role');
  const to = role === 'patron' ? '/p' : role === 'inspector' ? '/i' : '/m';
  return <Navigate to={`${to}${search}`} replace />;
};

export const App = () => (
  <BrowserRouter>
    <Routes>
      <Route element={<Shell />}>
        <Route index element={<Home />} />
        <Route path="m" element={<Today />} />
        <Route path="m/book" element={<Book />} />
        <Route path="m/review" element={<Review />} />
        <Route path="m/confirmed/:id" element={<Confirmed />} />
        <Route path="m/jobs/:id" element={<Tracking />} />
        <Route path="m/jobs/:id/rate" element={<Rate />} />
        <Route path="m/properties" element={<Properties />} />
        <Route path="m/bookings" element={<Bookings />} />
        <Route path="m/account" element={<Account />} />
        <Route path="p" element={<Jobs />} />
        <Route path="p/jobs/:id" element={<JobDetail />} />
        <Route path="p/jobs/:id/clean" element={<Checklist />} />
        <Route path="p/messages" element={<Messages />} />
        <Route path="p/earnings" element={<Earnings />} />
        <Route path="p/profile" element={<PatronProfile />} />
        <Route path="i" element={<Queue />} />
        <Route path="i/inspect/:id" element={<Inspection />} />
        <Route path="i/map" element={<MapScreen />} />
        <Route path="i/history" element={<History />} />
        <Route path="i/profile" element={<InspectorProfile />} />
        <Route path="*" element={<Navigate to="/m" replace />} />
      </Route>
    </Routes>
  </BrowserRouter>
);
