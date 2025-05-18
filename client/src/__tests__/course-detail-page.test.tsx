
import { render, screen } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import CourseDetailPage from '../pages/course-detail-page';
import { useAuth } from '../hooks/use-auth';

// Mock the auth hook
jest.mock('../hooks/use-auth', () => ({
  useAuth: jest.fn()
}));

// Mock wouter
jest.mock('wouter', () => ({
  useParams: () => ({ id: '123' }),
  useLocation: () => ['/courses/123', () => {}]
}));

const mockCourse = {
  id: 123,
  title: "Test Course",
  description: "Test Description",
  imageUrl: "test.jpg",
  price: 9900,
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
      title: "Lesson 1",
      content: "Lesson 1 content",
      duration: 30,
      videoUrl: "video1.mp4"
    },
    {
      id: 2,
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

  it('should render course lessons correctly', async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <CourseDetailPage />
      </QueryClientProvider>
    );

    // Wait for lessons to be loaded
    const lesson1 = await screen.findByText('Lesson 1');
    const lesson2 = await screen.findByText('Lesson 2');

    expect(lesson1).toBeInTheDocument();
    expect(lesson2).toBeInTheDocument();
  });

  it('should display lesson durations', async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <CourseDetailPage />
      </QueryClientProvider>
    );

    const duration1 = await screen.findByText('30 min');
    const duration2 = await screen.findByText('45 min');

    expect(duration1).toBeInTheDocument();
    expect(duration2).toBeInTheDocument();
  });

  it('should handle loading state', () => {
    render(
      <QueryClientProvider client={queryClient}>
        <CourseDetailPage />
      </QueryClientProvider>
    );

    const loadingElements = screen.getAllByTestId('skeleton');
    expect(loadingElements.length).toBeGreaterThan(0);
  });
});
