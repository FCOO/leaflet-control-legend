# leaflet-control-legend
Leaflet control for legends. Legends can be added to the control.

## Demo
http://jblarsen.github.io/leaflet-control-legend/

## Requirements
Leaflet and moment.

http://leafletjs.com/

http://momentjs.com/

## Usage
Install the dependencies and include the Javascript and CSS
file in this repository in your application.

Example usage:

        var legendControl = new L.Control.Legend;
        map.addControl(legendControl);
        legendControl.addLegend({
            imageUrl: 'images/colorbar2.png',
            attribution: '<a href="http://fcoo.dk">FCOO</a>',
            longName: 'Temperature',
            units: 'degC',
            lastUpdated: moment(new Date)
        });

## Attribution
Original code based on:

https://github.com/buche/leaflet-openweathermap

