# leaflet-control-legend
>


## Description
Leaflet control for legends. Legends can be added to the control.

## Installation
### bower
`bower install https://github.com/FCOO/leaflet-control-legend.git --save`

## Demo
http://FCOO.github.io/leaflet-control-legend/demo/ 

## Usage


        var legendControl = new L.Control.Legend;
        map.addControl(legendControl);
        legendControl.addLegend({
            imageUrl: 'images/colorbar2.png',
            attribution: '<a href="http://fcoo.dk">FCOO</a>',
            longName: 'Temperature',
            units: 'degC',
            lastUpdated: moment(new Date)
        });



## Copyright and License
This plugin is licensed under the [MIT license](https://github.com/FCOO/leaflet-control-legend/LICENSE).

Copyright (c) 2015 [FCOO](https://github.com/FCOO)

## Contact information

Jesper Larsen jla@fcoo.dk


## Credits and acknowledgements

Original code based on: https://github.com/buche/leaflet-openweathermap

## Known bugs

## Troubleshooting

## Changelog



