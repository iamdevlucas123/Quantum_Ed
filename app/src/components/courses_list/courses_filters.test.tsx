import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import CoursesFilters from './courses_filters';

describe('CoursesFilters', () => {
  it('renders course totals and active subjects', () => {
    render(
      <CoursesFilters
        activeSubject="AI Engineering"
        allCoursesCount={4}
        isLoading={false}
        onSearchChange={vi.fn()}
        onSubjectChange={vi.fn()}
        searchTerm=""
        subjects={['All Tracks', 'AI Engineering']}
        totalCourses={2}
      />,
    );

    expect(screen.getByText('2 courses available')).toBeInTheDocument();
    expect(screen.getByText('4 total')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'AI Engineering' })).toHaveAttribute('aria-pressed', 'true');
  });

  it('renders loading and search result labels', () => {
    const { rerender } = render(
      <CoursesFilters
        activeSubject="All Tracks"
        allCoursesCount={4}
        isLoading
        onSearchChange={vi.fn()}
        onSubjectChange={vi.fn()}
        searchTerm=""
        subjects={['All Tracks']}
        totalCourses={0}
      />,
    );

    expect(screen.getByText('Loading catalog')).toBeInTheDocument();

    rerender(
      <CoursesFilters
        activeSubject="All Tracks"
        allCoursesCount={4}
        isLoading={false}
        onSearchChange={vi.fn()}
        onSubjectChange={vi.fn()}
        searchTerm=" rag "
        subjects={['All Tracks']}
        totalCourses={1}
      />,
    );

    expect(screen.getByText('1 result for "rag"')).toBeInTheDocument();
  });

  it('calls filter callbacks from user interactions', async () => {
    const user = userEvent.setup();
    const onSearchChange = vi.fn();
    const onSubjectChange = vi.fn();

    render(
      <CoursesFilters
        activeSubject="All Tracks"
        allCoursesCount={4}
        isLoading={false}
        onSearchChange={onSearchChange}
        onSubjectChange={onSubjectChange}
        searchTerm="ai"
        subjects={['All Tracks', 'AI Engineering']}
        totalCourses={2}
      />,
    );

    await user.type(screen.getByRole('searchbox', { name: 'Search courses' }), 'x');
    expect(onSearchChange).toHaveBeenCalledWith('aix');

    await user.click(screen.getByRole('button', { name: 'Clear search' }));
    expect(onSearchChange).toHaveBeenCalledWith('');

    await user.click(screen.getByRole('button', { name: 'AI Engineering' }));
    expect(onSubjectChange).toHaveBeenCalledWith('AI Engineering');
  });
});
