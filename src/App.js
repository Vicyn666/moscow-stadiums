/*global google*/
import React, {
  Component
} from 'react';
import LeftPanel from './LeftPanel';
class App extends Component {
  state = {
    //initial data of 7 stadiums names and locations
    stadiums: [
      {
        name:'Luzhniki Stadium',
        lat:55.71573203760629,
        lng:37.55373034421461
      },
      {
        name:'Stadium im.Streltsova',
        lat:55.7163301,
        lng:37.6564336
      },
      {
        name:'Stadium "Octyabr`"',
        lat:55.79149859268806,
        lng:37.45134115219116
      },
      {
        name:'Stadium VEB-Arena',
        lat:55.7913598606502,
        lng:37.51622915267944
      },
      {
        name:'Otkrytie Stadium',
        lat:55.81782056892749,
        lng:37.43919400000001
      },
      {
        name: 'VTB Arena Stadium',
        lat:55.79174574401382,
        lng:37.560570875190095
      },
        {
        name:'RZD Arena Stadium',
        lat:55.803591638970246,
        lng:37.741148471832275
      },
      {
        name:'Yantar Stadium',
        lat:55.80112878090082,
        lng:37.4151033266109
      }
    ],
    map: '',
    markers: [],
    defaultMarkers: [],
    infowindow: '',
    isOpen: true
  }

//initialisation of google.map after the loading of content with personal key
  componentDidMount = () => {
    window.initMap = this.initMap;
    generateMap('https://maps.googleapis.com/maps/api/js?key=AIzaSyDc-WE-UOq2fDVZGC8Lt1fJHWTf_p7s3ps&callback=initMap')
  }

  initMap = () => {
    var map = new google.maps.Map(document.getElementById('map'), {
      center: {
        lat: 55.76678429673948,
        lng: 37.6281773847104
      },
      zoom: 11
    });
    this.setState({
      map: map
    })

//creating new list of objects with extended markers-stadiums: locations, names, icon etc.
    var bounds = new google.maps.LatLngBounds();
    var allStadiums = [];
    this.state.stadiums.forEach(eachStad => {
      var marker = new google.maps.Marker({
        position: {
          lat: eachStad.lat,
          lng: eachStad.lng
        },
        map: map,
        title: eachStad.name,
        icon: './icon.png',
        animation: window.google.maps.Animation.DROP
      })
      allStadiums.push(marker);

      //modifying the map size to all markers-stadiums
      var locations = new google.maps.LatLng(marker.position.lat(), marker.position.lng());
      bounds.extend(locations);
      //event listener for markers to open infowindow
      google.maps.event.addListener(marker,'click',()=> {
        this.openInfoWindow(marker);
      })
    })
      this.setState({
      markers: allStadiums,
      defaultMarkers: allStadiums
    })

  var infowindow = new google.maps.InfoWindow();
    this.setState({
      infowindow:infowindow
    })
  }

//animation for bouncing of icon on click + requesting of additional data from foursquare + opening of InfoWindow with this data
  openInfoWindow = (marker) => {
    marker.setAnimation(window.google.maps.Animation.BOUNCE);
    setTimeout(function() {
      marker.setAnimation(null);
    }, 1500);

//centering map on selected marker-stadium
    this.state.map.setCenter(marker.getPosition());

    var lat = marker.getPosition().lat();
    var lng = marker.getPosition().lng();
//retrieving venue basic info from foursquare according to the location and category of venue(football stadium)
    var request = "https://api.foursquare.com/v2/venues/search?client_id=0GKD3RMUM1VKZNGPU3S4BB4VZU2IADX1JM5AL2X2MDHYRHPW&client_secret=XWARF1C1LI2PRENKBKPKRZNZKF5OVIWSZIYUCAD4QRATJIHX&v=20180820&categoryId=4bf58dd8d48988d188941735&ll=" + lat + "," + lng + "";
//recognition of error during request
    fetch(request)
      .then((data)=>{
        if (data.status !== 200) {
          this.state.infowindow.setContent('Error');
          return;
        }
        data.json()
          .then((data) => {
            var json = data.response.venues[0];
            fetch("https://api.foursquare.com/v2/venues/" + json.id + "/?client_id=0GKD3RMUM1VKZNGPU3S4BB4VZU2IADX1JM5AL2X2MDHYRHPW&client_secret=XWARF1C1LI2PRENKBKPKRZNZKF5OVIWSZIYUCAD4QRATJIHX&v=20180820")
              .then((resp) => {
                resp.json()
                  .then(data=>{
                    var venue = data.response.venue;
//3 fields from response of foursquare regarding our venue - name, ratin, likes
                    this.state.infowindow.setContent(`<b>Foursquare info:</b> <br>${venue.name} <br><br>Rating: ${venue.rating}<br>Likes: ${venue.likes.count}`)
                  })
              })
          })
      })
    ;

    this.state.infowindow.open(this.state.map,marker);
  }

  //searching the name in search field at LeftPanel: hiding opened infowindows, selecting matching markes-stadiums on the map
  filter = (event) => {
    this.state.infowindow.close();
      var filteredStadiums = [];
    if (event.target.value === '' || filteredStadiums.length === 0) {
      this.state.defaultMarkers.forEach((marker) => {
        if (marker.title.toLowerCase().indexOf(event.target.value.toLowerCase()) >= 0) {
          marker.setVisible(true);
          filteredStadiums.push(marker);
        } else {
          marker.setVisible(false);
        }
      });
    } else {
      this.state.markers.forEach((marker) => {
        if (marker.title.toLowerCase().indexOf(event.target.value) >= 0) {
          marker.setVisible(true);
          filteredStadiums.push(marker);
        } else {
          marker.setVisible(false);
        }
      });
    }
    this.setState({
      markers: filteredStadiums
    })
  }

//left panel hiding/unhiding
  toggleNav = () => {
    document.getElementById('left-panel').classList.toggle('hide-panel')
    if (document.getElementById('left-panel').className === 'hide-panel') {
      this.setState({
        isOpen: false
      })
    }
    this.state.infowindow.close();
  }

//rendering page stusture and connecting leftpanel component
  render = () => {
    return (
      <div id = "container">
        <span id = "toggle-nav" onClick = {this.toggleNav}>&#9776;</span>
        <LeftPanel
          stadiums={this.state.markers}
          openInfoWindow={this.openInfoWindow}
          filter={this.filter}
          isOpen={this.props.isOpen}
        />
        <div id = "map-container" role = "application" tabIndex = "-1" >
          <div id = "map" style = {{ height: window.innerHeight + "px" }} >
          </div>
        </div>
      </div>
    );
  }
}

export default App;

//basic function with script for google.map initialisation
function generateMap(googleUrl) {

  var refers = window.document.getElementsByTagName('script')[0];
  var script = window.document.createElement('script');
  script.src = googleUrl;
  script.async = true;
  refers.parentNode.insertBefore(script, refers);
}
