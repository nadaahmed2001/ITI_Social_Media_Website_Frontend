// ViewPublicProfileWrapper.jsx
import { useParams } from 'react-router-dom';
import ViewPublicProfile from './ViewPublicProfile';

const ViewPublicProfileWrapper = () => {
  const { profileId } = useParams();
  return <ViewPublicProfile profileId={profileId} />;
};

export default ViewPublicProfileWrapper;
