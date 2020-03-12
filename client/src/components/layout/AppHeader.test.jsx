import { MuiThemeProvider } from '@material-ui/core';
import { createMount } from '@material-ui/core/test-utils';
import '@testing-library/jest-dom/extend-expect';
import React from 'react';
import { AppContext, NameContext } from '../../app';
import { darkTheme } from '../../styles';
import AppHeader from './AppHeader';

let username;
let mount;
let wrapper;

describe('<AppHeader />', () => {
  beforeEach(() => {
    mount = createMount();
    username = 'Test';
  });

  afterEach(() => {
    mount.cleanUp();
  });

  it('should work', () => {
    wrapper = mount(
      <MuiThemeProvider theme={darkTheme}>
        <AppContext.Provider value={{ switchTheme: jest.fn() }}>
          <NameContext.Provider value={{ username }}>
            <AppHeader />
          </NameContext.Provider>
        </AppContext.Provider>
      </MuiThemeProvider>
    );
  });

  test('renders correctly', () => {
    expect(wrapper).toMatchSnapshot();
  });

  test('render username and title correctly', () => {
    expect(wrapper.find("[data-testid='title']").exists()).toBeTruthy();
    expect(wrapper.find("[data-testid='username']").exists()).toBeTruthy();
    expect(wrapper.text().includes('project wag')).toBe(true);
    expect(wrapper.text().includes(username)).toBe(true);
  });

  test('render theme correctly', () => {});
});
