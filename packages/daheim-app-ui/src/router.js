import React from 'react'
import {Router, Route, IndexRoute, applyRouterMiddleware} from 'react-router'
import {useScroll} from 'react-router-scroll';
import Helmet from 'react-helmet'

import DefaultLayout from './containers/DefaultLayout'
import ReadyPage from './containers/ReadyPage'
import LessonPage from './containers/LessonPage'

import AuthLayout from './components/auth/AuthLayout'
import LoginPage from './components/auth/LoginPage'
import RegistrationPage from './components/auth/RegistrationPage'
import ForgotPasswordPage from './components/auth/ForgotPasswordPage'
import ResetPasswordPage from './components/auth/ResetPasswordPage'
import LogoutPage from './components/auth/LogoutPage'
import SettingsPage from './components/auth/SettingsPage'

import AdminPage from './components/admin/AdminPage'

import PublicProfilePage from './components/profile/PublicProfilePage'
import EditProfilePage from './components/profile/EditProfilePage'
import ReportUserPage from './components/profile/ReportUserPage'

import HelpPage from './components/help/HelpPage'

import NotFoundPage from './containers/NotFoundPage'
import AvatarMakerPage from './components/avatar/AvatarMaker'

import {Color} from './styles'

const scrollCallback = (prevRouterProps, { routes }) => {
  const isModal = routes[routes.length-1].modal
  return !isModal;
}

export default function createRouter (history) {
  return (
    <div>
      <Helmet
        defaultTitle='Daheim | Reden. Lernen. Leben.'
        titleTemplate='%s | Daheim'
      />
      <Router
        history={history}
        render={applyRouterMiddleware(useScroll(scrollCallback))}
        >
        <Route path='/' component={DefaultLayout}>
          <IndexRoute component={ReadyPage} />
          <Route path='lessons/:lessonId' component={LessonPage} modal={true} backTo={'/'}/>
          <Route path='profile' component={EditProfilePage} />
          <Route path='users/:userId' component={PublicProfilePage} modal={true}/>
          <Route path='users/:userId/report' component={ReportUserPage} />
          <Route path='admin' component={AdminPage} />
          <Route path='settings' component={SettingsPage} />
          <Route path='help' component={HelpPage} />
          <Route path='avatar' component={AvatarMakerPage} />
        </Route>

        <Route path='/auth' component={AuthLayout}>
          <IndexRoute component={LoginPage} />
          <Route path='register' component={RegistrationPage} />
          <Route path='forgot' component={ForgotPasswordPage} />
          <Route path='reset' component={ResetPasswordPage} />
          <Route path='logout' component={LogoutPage} />
        </Route>

        <Route path='*' component={DefaultLayout}>
          <IndexRoute component={NotFoundPage} modal={true} backTo={'/'} modalColor={Color.red}/>
        </Route>
      </Router>
    </div>
  )
}
