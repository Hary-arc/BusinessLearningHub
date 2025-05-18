
import { render, screen, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import CourseDetailPage from '../pages/course-detail-page';
import { useAuth } from '@/hooks/use-auth';

// Mock the auth hook
jest.mock('@/hooks/use-auth', () => ({
  useAuth: jest.fn()
}));

// Mock wouter
jest.mock('wouter', () => ({
  useParams: () => ({ id: '123' }),
  useLocation: () => ['/courses/123', () => {}]
}));

// Mock Razorpay
window.Razorpay = jest.fn().mockImplementation(() => ({
  open: jest.fn()
}));

const mockCourse = {
  id: 123,
  _id: '123',
  title: "Test Course",
  description: "Test Description",
  imageUrl: "test.jpg",
  price: 9900,
  currency: "INR",
  facultyId: 1,
  category: "Test Category",
  rating: 4.5,
  reviewCount: 10,
  published: true,
  duration: 120,
  level: "Intermediate",
  featured: false,
  lessons: [
    {
      id: 1,
      _id: '1',
      title: "Lesson 1",
      content: "Lesson 1 content",
      duration: 30,
      videoUrl: "video1.mp4"
    },
    {
      id: 2,
      _id: '2',
      title: "Lesson 2", 
      content: "Lesson 2 content",
      duration: 45,
      videoUrl: "video2.mp4"
    }
  ]
};

describe('CourseDetailPage', () => {
  let queryClient: QueryClient;

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: {
          retry: false,
        },
      },
    });
    
    (useAuth as jest.Mock).mockReturnValue({
      user: { fullName: 'Test User', email: 'test@example.com' }
    });

    // Mock fetch calls
    global.fetch = jest.fn().mockImplementation(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockCourse)
      })
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should render course details correctly', async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <CourseDetailPage />
      </QueryClientProvider>
    );

    await waitFor(() => {
      expect(screen.getByText('Test Course')).toBeInTheDocument();
      expect(screen.getByText('Test Description')).toBeInTheDocument();
      expect(screen.getByText('Test Category')).toBeInTheDocument();
    });
  });

  it('should render course lessons correctly', async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <CourseDetailPage />
      </QueryClientProvider>
    );

    await waitFor(() => {
      expect(screen.getByText('Lesson 1')).toBeInTheDocument();
      expect(screen.getByText('Lesson 2')).toBeInTheDocument();
    });
  });

  it('should display lesson durations', async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <CourseDetailPage />
      </QueryClientProvider>
    );

    await waitFor(() => {
      expect(screen.getByText('30 min')).toBeInTheDocument();
      expect(screen.getByText('45 min')).toBeInTheDocument();
    });
  });

  it('should handle loading state', () => {
    render(
      <QueryClientProvider client={queryClient}>
        <CourseDetailPage />
      </QueryClientProvider>
    );

    const skeletons = screen.getAllByTestId('skeleton');
    expect(skeletons.length).toBeGreaterThan(0);
  });
});
