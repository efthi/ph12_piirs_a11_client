import { useQuery } from '@tanstack/react-query';
import IssueCard from '../issues/IssueCard';
import Loader from '../shared/Loader';
import axios from 'axios';
import useAxiosPub from '../../hooks/useAxiosPub';

const LatestIssues = () => {
 const axiosPub = useAxiosPub()
  const { data: issues, isLoading, isError } = useQuery({
    queryKey: ['latestIssues'],
    queryFn: async () => {
      const response = await axiosPub.get('/api/latest-resolved-issues');
      return response.data;
    }
  });


//  const issues = data;

  if (isLoading) {
    return <Loader />;
  }

  return (
    <section className="max-w-7xl mx-auto px-4 py-16">
      <div className="text-center mb-12">
        <h2 className="text-4xl md:text-5xl font-bold mb-4">
          Latest Resolved Issues
        </h2>
        <p className="text-lg opacity-70">
          See how we're making Port City better, one issue at a time
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {issues?.map((issue) => (
          <IssueCard key={issue._id} issue={issue} />
        ))}
      </div>

      <div className="text-center mt-12">
        <a href="/all-issues" className="btn btn-primary btn-lg">
          View All Issues
        </a>
      </div>
    </section>
  );
};

export default LatestIssues;