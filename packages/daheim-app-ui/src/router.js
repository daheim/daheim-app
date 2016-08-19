import React from 'react'
import {Router, Route, IndexRoute} from 'react-router'
import Helmet from 'react-helmet'

import DefaultLayout, {DefaultLayoutWithBreadcrumbs} from './containers/DefaultLayout'
import ReadyPage from './containers/ReadyPage'
import LessonPage from './containers/LessonPage'

import AuthLayout from './components/auth/AuthLayout'
import LoginPage from './components/auth/LoginPage'
import RegistrationPage from './components/auth/RegistrationPage'
import ForgotPasswordPage from './components/auth/ForgotPasswordPage'
import ResetPasswordPage from './components/auth/ResetPasswordPage'
import LogoutPage from './components/auth/LogoutPage'
import ChangePasswordPage from './components/auth/ChangePasswordPage'

import AdminPage from './components/admin/AdminPage'

import PublicProfilePage from './components/profile/PublicProfilePage'
import EditProfilePage from './components/profile/EditProfilePage'
import ReportUserPage from './components/profile/ReportUserPage'

import NotFoundPage from './containers/NotFoundPage'
import AvatarMakerPage from './components/avatar/AvatarMaker'

export default function createRouter (history) {
  return (
    <div>
      <Helmet
        defaultTitle='Daheim | Reden. Lernen. Leben.'
        titleTemplate='%s | Daheim'
      />
      <Router history={history}>
        <Route path='/' component={DefaultLayout}>
          <IndexRoute component={ReadyPage} />

          <Route path='/' component={DefaultLayoutWithBreadcrumbs}>
            <Route path='lessons/:lessonId' component={LessonPage} />
            <Route path='profile' component={EditProfilePage} />
            <Route path='users/:userId' component={PublicProfilePage} />
            <Route path='users/:userId/report' component={ReportUserPage} />
            <Route path='admin' component={AdminPage} />
            <Route path='password' component={ChangePasswordPage} />
            <Route path='avatar' component={AvatarMakerPage} />
          </Route>
        </Route>

        <Route path='/auth' component={AuthLayout}>
          <IndexRoute component={LoginPage} />
          <Route path='register' component={RegistrationPage} />
          <Route path='forgot' component={ForgotPasswordPage} />
          <Route path='reset' component={ResetPasswordPage} />
          <Route path='logout' component={LogoutPage} />
        </Route>

        <Route path='*' component={AuthLayout}>
          <IndexRoute component={NotFoundPage} />
        </Route>
      </Router>
    </div>
  )
}
