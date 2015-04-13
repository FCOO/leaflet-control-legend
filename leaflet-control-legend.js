(function (){
    "use strict";
    /*jslint browser: true*/
    /*global L, console*/

    /**
     * A Leaflet control for showing one or more legends. Each legend contains
     * a colorbar, parameter name and units, source/attribution, and optionally
     * information about when the data was last updated.
     */
    L.Control.Legend = L.Control.extend({
        options: {
            position: "bottomleft",
            language: "en"
        },
            
        legendOptions: new Object(),

        initialize: function(map, options) {
            L.Util.setOptions(this, options);
            this._map = map;
            this._container = L.DomUtil.create('div', 'fcoo-legend-container');
            this._container.style.display = 'none';
            this._legendCounter = 0;
        },

        onAdd: function(map) {
            return this._container;
        },

        addLegend: function(legendOptions) {
            var legendId = this._legendCounter++;
            this.legendOptions[legendId] = legendOptions;
            this._redrawLegend();
            this._container.style.display = 'block';
            return legendId;
        },

        removeLegend: function(legendId) {
            if (typeof this.legendOptions[legendId] != 'undefined') {
                delete this.legendOptions[legendId];
            }
            // reset counter if no legend is in collection
            var containerEmpty = true;
            for (var idx in this.legendOptions) {
                containerEmpty = false;
                break;
            }
            if (containerEmpty) {
                this.legendOptions = new Object();
                this._container.style.display = 'none';
            }
            this._redrawLegend();
        },

        _redrawLegend: function() {
            this._container.innerHTML = ''; // clear container
            var isLeft = this.options.position.indexOf('left') !== -1;
            var cssFloat = isLeft ? 'left' : 'right';
            var lang = this.options.language;
            for (var idx in this.legendOptions) {
                var imgUrl = this.legendOptions[idx].imageUrl;
                var attribution = this.legendOptions[idx].attribution;
                var lastUpdated = this.legendOptions[idx].lastUpdated;
                var longName = this.legendOptions[idx].longName;
                var units = this.legendOptions[idx].units;
                units = this._(units, lang);
                var item = L.DomUtil.create('div', 'fcoo-legend-item', this._container);
                item.style.cssFloat = cssFloat;
                if (isLeft) {
                    item.style.marginRight = '10px';
                } else {
                    item.style.marginLeft = '10px';
                }
                var leginner = '<img src="' + imgUrl + '" border="0" height="40" width="250" />';
                if (longName !== undefined) {
                    var longNameCap =
                        longName.charAt(0).toUpperCase() +
                        longName.slice(1);
                    longNameCap = this._(longNameCap, lang);
                    leginner = leginner + '<br />' + longNameCap;
                    if (units !== undefined && units != '') {
                        leginner = leginner + ' [' + units + ']';
                    }
                }
                if (attribution !== undefined) {
                    var source = this._('Source', lang);
                    leginner = leginner + '<br />' + source + ': ' +
                               attribution;
                }
                if (lastUpdated !== undefined) {
                    var luString = this._('Last updated', lang);
                    leginner = leginner + '<br />' + luString +
                        ': ' +
                        lastUpdated.utc().format('YYYY-MM-DDTHH:mm') + ' UTC';
                }
                item.innerHTML = leginner;
                var br = L.DomUtil.create('br', '', this._container);
            }
        },

        /**
         * Internationalization of some texts used in the legend.
         * @param String key the key of the text item
         * @param String lang the language id
         * @return String the localized text item or the id if there's no translation found
         */
        _: function(key, lang) {
            var i18n = {
                en: {
                      'Significant wave height of combined wind waves and swell': 'Wave height',
                      'degC': '&deg;C',
                      'Temp.': 'Temperature'
                },
                da: {
                      'Source': 'Kilde',
                      'Last updated': 'Sidst opdateret',
                      'Wave height': 'Bølgehøjde',
                      'Mean wave period': 'Bølgeperiode',
                      'Vel.': 'Strøm (fart)',
                      'Elevation': 'Vandstand',
                      'Temperature': 'Temperatur',
                      'Temp.': 'Temperatur',
                      'Salinity': 'Salinitet',
                      'Sea surface temperature': 'Temperatur',
                      'Sea surface salinity': 'Salinitet',
                      'Wind speed': 'Vind (fart)',
                      'Wind': 'Vind (fart)',
                      'Air temperature (2m)': '2 meter temperatur',
                      'Sea ice concentration': 'Haviskoncentration',
                      'Visibility': 'Sigtbarhed',
                      'Total precipitation flux': 'Nedbør',
                      '2 metre temperature': '2 meter temperatur',
                      'Total cloud cover': 'Skydække',
                      'Significant wave height of combined wind waves and swell': 'Bølgehøjde',
                      'mm/hour': 'mm/time',
                      'degC': '&deg;C',
                      'knots': 'knob',
                      'fraction': 'fraktion',
                      'meters': 'meter'
                }
            };
        
            if (i18n[lang] !== undefined && i18n[lang][key] !== undefined) {
                return  i18n[lang][key];
            } else if (i18n.en !== undefined && i18n.en[key] !== undefined) {
                return  i18n.en[key];
            }
            return key;
        }
    });
})();

