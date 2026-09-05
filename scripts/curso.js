const courses = [
  {
    subject: 'CSE',
    number: 110,
    title: 'Introduction to Programming',
    credits: 2,
    certificate: 'Web and Computer Programming',
    description: 'This course will introduce the basic concepts of programming using Python.',
    technology: ['Python'],
    completed: true
  },
  {
    subject: 'WDD',
    number: 130,
    title: 'Web Fundamentals',
    credits: 2,
    certificate: 'Web and Computer Programming',
    description: 'This course introduces students to the World Wide Web and to careers in web site design and development.',
    technology: ['HTML', 'CSS'],
    completed: true
  },
  {
    subject: 'CSE',
    number: 111,
    title: 'Programming with Functions',
    credits: 2,
    certificate: 'Web and Computer Programming',
    description: 'CSE 111 students write programs that contain user defined functions and use other functions from Python modules.',
    technology: ['Python'],
    completed: true
  },
  {
    subject: 'CSE',
    number: 210,
    title: 'Programming with Classes',
    credits: 2,
    certificate: 'Web and Computer Programming',
    description: 'This course introduces the concepts of object-oriented programming to students.',
    technology: ['C#'],
    completed: false
  },
  {
    subject: 'WDD',
    number: 131,
    title: 'Dynamic Web Fundamentals',
    credits: 2,
    certificate: 'Web and Computer Programming',
    description: 'Students learn to create dynamic web sites using JavaScript, HTML, and CSS.',
    technology: ['HTML', 'CSS', 'JavaScript'],
    completed: true
  },
  {
    subject: 'WDD',
    number: 231,
    title: 'Frontend Web Development I',
    credits: 2,
    certificate: 'Web and Computer Programming',
    description: 'Students will focus on user experience, accessibility, compliance, and progressive enhancement.',
    technology: ['HTML', 'CSS', 'JavaScript'],
    completed: false
  }
];

const coursesContainer = document.querySelector('#coursesContainer');
const totalCreditsElement = document.querySelector('#totalCredits');
const filterButtons = document.querySelectorAll('.filter-btn');

function renderCourses(courseList) {
  if (!coursesContainer) return;
  coursesContainer.innerHTML = '';

  courseList.forEach(course => {
    const card = document.createElement('div');
    card.className = `course-card ${course.completed ? 'completed' : ''}`;
    card.textContent = `${course.subject} ${course.number}`;
    coursesContainer.appendChild(card);
  });

  if (totalCreditsElement) {
    const totalCredits = courseList.reduce((acc, course) => acc + course.credits, 0);
    totalCreditsElement.textContent = totalCredits;
  }
}

function setupFilters() {
  filterButtons.forEach(button => {
    button.addEventListener('click', () => {
      filterButtons.forEach(btn => btn.classList.remove('active'));
      button.classList.add('active');

      const filterType = button.getAttribute('data-filter');
      if (filterType === 'all') {
        renderCourses(courses);
      } else {
        const filtered = courses.filter(course => course.subject.toLowerCase() === filterType.toLowerCase());
        renderCourses(filtered);
      }
    });
  });
}

document.addEventListener('DOMContentLoaded', () => {
  renderCourses(courses);
  setupFilters();
});
