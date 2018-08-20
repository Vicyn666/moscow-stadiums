import React, {
  Component
} from 'react';

class LeftPanel extends Component {
  state = {
    query: ''
  }
  render = () => {
    return (
      <div id = "left-panel">
      <input type = "text" placeholder = "Enter the name"
      id = "search-fild"
      onChange = {this.props.filter}/>
      <ul id = "all-stadiums">
      {
        this.props.stadiums.map((mark,index) => {
            return ( <li key = {index}
              className = "stadiums-list"
              onClick = {
                this.props.openInfoWindow.bind(this,mark)
              }
              value = {
                this.state.query
              }
              tabIndex = {
                this.props.isOpen ? -1 : 0} >
              {
                mark.title
              } </li>)
            })
        }
        </ul>
        </div>
      );
    }
  }
  export default LeftPanel
