import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import { defineComponent, h } from 'vue';

// Create a mock NuxtPage component
const mockNuxtPage = defineComponent({
  name: 'NuxtPage',
  render() {
    return h('div', { class: 'nuxt-page-mock' }, 'Mocked Page Content');
  }
});

// Mock the environment variables
vi.mock('process', () => ({
  env: {
    NODE_ENV: 'development'
  }
}));

describe('App Component', () => {
  it('should render the header with environment badge', async () => {
    // Import the component after mocking
    const { default: AppComponent } = await import('../../app.vue');
    
    // Mount the component with mocked NuxtPage
    const wrapper = mount(AppComponent, {
      global: {
        stubs: {
          NuxtPage: mockNuxtPage
        }
      }
    });
    
    // Assert the header is rendered
    expect(wrapper.find('.app-header').exists()).toBe(true);
    
    // Assert the environment badge is rendered
    const badge = wrapper.find('.environment-badge');
    expect(badge.exists()).toBe(true);
    expect(badge.text()).toBe('DEVELOPMENT');
    
    // Assert the badge has the correct class for development
    expect(badge.classes()).not.toContain('env-prod');
  });
}); 