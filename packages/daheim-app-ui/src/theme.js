import * as Colors from 'material-ui/styles/colors'
import {fade} from 'material-ui/utils/colorManipulator'
import Spacing from 'material-ui/styles/spacing'
import zIndex from 'material-ui/styles/zIndex'
import getMuiTheme from 'material-ui/styles/getMuiTheme'

const raw = {
  spacing: Spacing,
  zIndex,
  fontFamily: 'Roboto, sans-serif',
  palette: {
    primary1Color: Colors.indigo500,
    primary2Color: Colors.indigo700,
    primary3Color: Colors.lightBlack,
    accent1Color: Colors.pinkA200,
    accent2Color: Colors.grey100,
    accent3Color: Colors.grey500,
    textColor: Colors.darkBlack,
    alternateTextColor: Colors.white,
    canvasColor: Colors.white,
    borderColor: Colors.grey300,
    disabledColor: fade(Colors.darkBlack, 0.3),
    pickerHeaderColor: Colors.indigo500
  }
}

let mui = getMuiTheme(raw)
export default mui
