import { useQuery } from '@tanstack/react-query';
import IssueCard from '../issues/IssueCard';
import Loader from '../shared/Loader';

const LatestIssues = () => {
  // Demo data - পরে API call দিয়ে replace করবে
  const demoIssues = [
    {
      _id: '1',
      title: "Broken Streetlight on Station Road",
      category: "Streetlight",
      status: "Resolved",
      priority: "High",
      location: "Station Road, Chattogram",
      upvotes: 45,
      image: "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=400&h=300&fit=crop",
      createdAt: new Date().toISOString()
    },
    {
      _id: '2',
      title: "Large Pothole Near GEC Circle",
      category: "Road Damage",
      status: "Resolved",
      priority: "High",
      location: "GEC Circle, Chattogram",
      upvotes: 89,
      image: "https://images.unsplash.com/photo-1585208798174-6cedd86e019a?w=400&h=300&fit=crop",
      createdAt: new Date().toISOString()
    },
    {
      _id: '3',
      title: "Water Leakage in Agrabad Area",
      category: "Water Supply",
      status: "Resolved",
      priority: "Normal",
      location: "Agrabad, Chattogram",
      upvotes: 32,
      image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&h=300&fit=crop",
      createdAt: new Date().toISOString()
    },
    {
      _id: '4',
      title: "Garbage Overflow at Panchlaish",
      category: "Garbage",
      status: "Resolved",
      priority: "High",
      location: "Panchlaish, Chattogram",
      upvotes: 67,
      image: "https://images.unsplash.com/photo-1611284446314-60a58ac0deb9?w=400&h=300&fit=crop",
      createdAt: new Date().toISOString()
    },
    {
      _id: '5',
      title: "Damaged Footpath at Kazir Dewri",
      category: "Footpath",
      status: "Resolved",
      priority: "Normal",
      location: "Kazir Dewri, Chattogram",
      upvotes: 28,
      image: "https://images.unsplash.com/photo-1534237886190-ced735ca4b73?w=400&h=300&fit=crop",
      createdAt: new Date().toISOString()
    },
    {
      _id: '6',
      title: "Blocked Drainage System",
      category: "Drainage",
      status: "Resolved",
      priority: "High",
      location: "Chawkbazar, Chattogram",
      upvotes: 54,
      image: "https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=400&h=300&fit=crop",
      createdAt: new Date().toISOString()
    }
  ];

  // পরে এভাবে API call করবে:
  // const { data: issues, isLoading } = useQuery({
  //   queryKey: ['latestIssues'],
  //   queryFn: async () => {
  //     const response = await axios.get('/api/issues?status=Resolved&limit=6&sort=-createdAt');
  //     return response.data;
  //   }
  // });

  const isLoading = false;
  const issues = demoIssues;

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