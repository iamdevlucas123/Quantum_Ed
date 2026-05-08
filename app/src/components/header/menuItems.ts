import type { NavigationMenu } from '../../types';

export const menuItems = {
  Frontend: {
    HTML: ['Semantic HTML', 'Forms', 'Accessibility'],
    CSS: ['Flexbox', 'Grid', 'Responsive Design'],
    JavaScript: ['DOM Manipulation', 'ES6+', 'Async/Await'],
    React: ['Hooks', 'State Management', 'Routing'],
    TypeScript: ['Types', 'Interfaces', 'Generics'],
  },

  Backend: {
    NodeJS: ['Express', 'REST APIs', 'Middleware'],
    Databases: ['PostgreSQL', 'MongoDB', 'Redis'],
    Authentication: ['JWT', 'OAuth2', 'Sessions'],
    APIs: ['REST', 'GraphQL', 'WebSockets'],
    Architecture: ['Microservices', 'Monoliths', 'Clean Architecture'],
  },

  DevOps: {
    Docker: ['Containers', 'Docker Compose', 'Volumes'],
    Kubernetes: ['Pods', 'Deployments', 'Services'],
    CI_CD: ['GitHub Actions', 'Pipelines', 'Automation'],
    Cloud: ['AWS', 'Azure', 'Google Cloud'],
    Monitoring: ['Logs', 'Metrics', 'Tracing'],
  },

  ComputerScience: {
    Algorithms: ['Sorting', 'Searching', 'Dynamic Programming'],
    DataStructures: ['Arrays', 'Trees', 'Graphs'],
    Networking: ['HTTP', 'TCP/IP', 'DNS'],
    OperatingSystems: ['Processes', 'Threads', 'Memory Management'],
    Security: ['OWASP Top 10', 'Encryption', 'Authentication'],
  },

  Mobile: {
    ReactNative: ['Navigation', 'Native Modules', 'Animations'],
    Android: ['Kotlin', 'Jetpack Compose', 'Activities'],
    IOS: ['Swift', 'SwiftUI', 'UIKit'],
    MobileArchitecture: ['MVVM', 'Clean Architecture', 'Offline First'],
  },
} as const satisfies NavigationMenu;
