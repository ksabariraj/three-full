var Three = (function (exports) {
	'use strict';

	/**
	 * https://github.com/mrdoob/eventdispatcher.js/
	 */

	function EventDispatcher() {}

	Object.assign( EventDispatcher.prototype, {

		addEventListener: function ( type, listener ) {

			if ( this._listeners === undefined ) this._listeners = {};

			var listeners = this._listeners;

			if ( listeners[ type ] === undefined ) {

				listeners[ type ] = [];

			}

			if ( listeners[ type ].indexOf( listener ) === - 1 ) {

				listeners[ type ].push( listener );

			}

		},

		hasEventListener: function ( type, listener ) {

			if ( this._listeners === undefined ) return false;

			var listeners = this._listeners;

			return listeners[ type ] !== undefined && listeners[ type ].indexOf( listener ) !== - 1;

		},

		removeEventListener: function ( type, listener ) {

			if ( this._listeners === undefined ) return;

			var listeners = this._listeners;
			var listenerArray = listeners[ type ];

			if ( listenerArray !== undefined ) {

				var index = listenerArray.indexOf( listener );

				if ( index !== - 1 ) {

					listenerArray.splice( index, 1 );

				}

			}

		},

		dispatchEvent: function ( event ) {

			if ( this._listeners === undefined ) return;

			var listeners = this._listeners;
			var listenerArray = listeners[ event.type ];

			if ( listenerArray !== undefined ) {

				event.target = this;

				var array = listenerArray.slice( 0 );

				for ( var i = 0, l = array.length; i < l; i ++ ) {

					array[ i ].call( this, event );

				}

			}

		}

	} );

	/**
	 * @author alteredq / http://alteredqualia.com/
	 * @author mrdoob / http://mrdoob.com/
	 */

	var _Math = {

		DEG2RAD: Math.PI / 180,
		RAD2DEG: 180 / Math.PI,

		generateUUID: function () {

			// http://www.broofa.com/Tools/Math.uuid.htm
			// Replaced .join with string concatenation (@takahirox)

			var chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split( '' );
			var rnd = 0, r;

			return function generateUUID() {

				var uuid = '';

				for ( var i = 0; i < 36; i ++ ) {

					if ( i === 8 || i === 13 || i === 18 || i === 23 ) {

						uuid += '-';

					} else if ( i === 14 ) {

						uuid += '4';

					} else {

						if ( rnd <= 0x02 ) rnd = 0x2000000 + ( Math.random() * 0x1000000 ) | 0;
						r = rnd & 0xf;
						rnd = rnd >> 4;
						uuid += chars[ ( i === 19 ) ? ( r & 0x3 ) | 0x8 : r ];

					}

				}

				return uuid;

			};

		}(),

		clamp: function ( value, min, max ) {

			return Math.max( min, Math.min( max, value ) );

		},

		// compute euclidian modulo of m % n
		// https://en.wikipedia.org/wiki/Modulo_operation

		euclideanModulo: function ( n, m ) {

			return ( ( n % m ) + m ) % m;

		},

		// Linear mapping from range <a1, a2> to range <b1, b2>

		mapLinear: function ( x, a1, a2, b1, b2 ) {

			return b1 + ( x - a1 ) * ( b2 - b1 ) / ( a2 - a1 );

		},

		// https://en.wikipedia.org/wiki/Linear_interpolation

		lerp: function ( x, y, t ) {

			return ( 1 - t ) * x + t * y;

		},

		// http://en.wikipedia.org/wiki/Smoothstep

		smoothstep: function ( x, min, max ) {

			if ( x <= min ) return 0;
			if ( x >= max ) return 1;

			x = ( x - min ) / ( max - min );

			return x * x * ( 3 - 2 * x );

		},

		smootherstep: function ( x, min, max ) {

			if ( x <= min ) return 0;
			if ( x >= max ) return 1;

			x = ( x - min ) / ( max - min );

			return x * x * x * ( x * ( x * 6 - 15 ) + 10 );

		},

		// Random integer from <low, high> interval

		randInt: function ( low, high ) {

			return low + Math.floor( Math.random() * ( high - low + 1 ) );

		},

		// Random float from <low, high> interval

		randFloat: function ( low, high ) {

			return low + Math.random() * ( high - low );

		},

		// Random float from <-range/2, range/2> interval

		randFloatSpread: function ( range ) {

			return range * ( 0.5 - Math.random() );

		},

		degToRad: function ( degrees ) {

			return degrees * _Math.DEG2RAD;

		},

		radToDeg: function ( radians ) {

			return radians * _Math.RAD2DEG;

		},

		isPowerOfTwo: function ( value ) {

			return ( value & ( value - 1 ) ) === 0 && value !== 0;

		},

		ceilPowerOfTwo: function ( value ) {

			return Math.pow( 2, Math.ceil( Math.log( value ) / Math.LN2 ) );

		},

		floorPowerOfTwo: function ( value ) {

			return Math.pow( 2, Math.floor( Math.log( value ) / Math.LN2 ) );

		}

	};

	/**
	 * @author mrdoob / http://mrdoob.com/
	 */

	var ColorKeywords = { 'aliceblue': 0xF0F8FF, 'antiquewhite': 0xFAEBD7, 'aqua': 0x00FFFF, 'aquamarine': 0x7FFFD4, 'azure': 0xF0FFFF,
		'beige': 0xF5F5DC, 'bisque': 0xFFE4C4, 'black': 0x000000, 'blanchedalmond': 0xFFEBCD, 'blue': 0x0000FF, 'blueviolet': 0x8A2BE2,
		'brown': 0xA52A2A, 'burlywood': 0xDEB887, 'cadetblue': 0x5F9EA0, 'chartreuse': 0x7FFF00, 'chocolate': 0xD2691E, 'coral': 0xFF7F50,
		'cornflowerblue': 0x6495ED, 'cornsilk': 0xFFF8DC, 'crimson': 0xDC143C, 'cyan': 0x00FFFF, 'darkblue': 0x00008B, 'darkcyan': 0x008B8B,
		'darkgoldenrod': 0xB8860B, 'darkgray': 0xA9A9A9, 'darkgreen': 0x006400, 'darkgrey': 0xA9A9A9, 'darkkhaki': 0xBDB76B, 'darkmagenta': 0x8B008B,
		'darkolivegreen': 0x556B2F, 'darkorange': 0xFF8C00, 'darkorchid': 0x9932CC, 'darkred': 0x8B0000, 'darksalmon': 0xE9967A, 'darkseagreen': 0x8FBC8F,
		'darkslateblue': 0x483D8B, 'darkslategray': 0x2F4F4F, 'darkslategrey': 0x2F4F4F, 'darkturquoise': 0x00CED1, 'darkviolet': 0x9400D3,
		'deeppink': 0xFF1493, 'deepskyblue': 0x00BFFF, 'dimgray': 0x696969, 'dimgrey': 0x696969, 'dodgerblue': 0x1E90FF, 'firebrick': 0xB22222,
		'floralwhite': 0xFFFAF0, 'forestgreen': 0x228B22, 'fuchsia': 0xFF00FF, 'gainsboro': 0xDCDCDC, 'ghostwhite': 0xF8F8FF, 'gold': 0xFFD700,
		'goldenrod': 0xDAA520, 'gray': 0x808080, 'green': 0x008000, 'greenyellow': 0xADFF2F, 'grey': 0x808080, 'honeydew': 0xF0FFF0, 'hotpink': 0xFF69B4,
		'indianred': 0xCD5C5C, 'indigo': 0x4B0082, 'ivory': 0xFFFFF0, 'khaki': 0xF0E68C, 'lavender': 0xE6E6FA, 'lavenderblush': 0xFFF0F5, 'lawngreen': 0x7CFC00,
		'lemonchiffon': 0xFFFACD, 'lightblue': 0xADD8E6, 'lightcoral': 0xF08080, 'lightcyan': 0xE0FFFF, 'lightgoldenrodyellow': 0xFAFAD2, 'lightgray': 0xD3D3D3,
		'lightgreen': 0x90EE90, 'lightgrey': 0xD3D3D3, 'lightpink': 0xFFB6C1, 'lightsalmon': 0xFFA07A, 'lightseagreen': 0x20B2AA, 'lightskyblue': 0x87CEFA,
		'lightslategray': 0x778899, 'lightslategrey': 0x778899, 'lightsteelblue': 0xB0C4DE, 'lightyellow': 0xFFFFE0, 'lime': 0x00FF00, 'limegreen': 0x32CD32,
		'linen': 0xFAF0E6, 'magenta': 0xFF00FF, 'maroon': 0x800000, 'mediumaquamarine': 0x66CDAA, 'mediumblue': 0x0000CD, 'mediumorchid': 0xBA55D3,
		'mediumpurple': 0x9370DB, 'mediumseagreen': 0x3CB371, 'mediumslateblue': 0x7B68EE, 'mediumspringgreen': 0x00FA9A, 'mediumturquoise': 0x48D1CC,
		'mediumvioletred': 0xC71585, 'midnightblue': 0x191970, 'mintcream': 0xF5FFFA, 'mistyrose': 0xFFE4E1, 'moccasin': 0xFFE4B5, 'navajowhite': 0xFFDEAD,
		'navy': 0x000080, 'oldlace': 0xFDF5E6, 'olive': 0x808000, 'olivedrab': 0x6B8E23, 'orange': 0xFFA500, 'orangered': 0xFF4500, 'orchid': 0xDA70D6,
		'palegoldenrod': 0xEEE8AA, 'palegreen': 0x98FB98, 'paleturquoise': 0xAFEEEE, 'palevioletred': 0xDB7093, 'papayawhip': 0xFFEFD5, 'peachpuff': 0xFFDAB9,
		'peru': 0xCD853F, 'pink': 0xFFC0CB, 'plum': 0xDDA0DD, 'powderblue': 0xB0E0E6, 'purple': 0x800080, 'rebeccapurple': 0x663399, 'red': 0xFF0000, 'rosybrown': 0xBC8F8F,
		'royalblue': 0x4169E1, 'saddlebrown': 0x8B4513, 'salmon': 0xFA8072, 'sandybrown': 0xF4A460, 'seagreen': 0x2E8B57, 'seashell': 0xFFF5EE,
		'sienna': 0xA0522D, 'silver': 0xC0C0C0, 'skyblue': 0x87CEEB, 'slateblue': 0x6A5ACD, 'slategray': 0x708090, 'slategrey': 0x708090, 'snow': 0xFFFAFA,
		'springgreen': 0x00FF7F, 'steelblue': 0x4682B4, 'tan': 0xD2B48C, 'teal': 0x008080, 'thistle': 0xD8BFD8, 'tomato': 0xFF6347, 'turquoise': 0x40E0D0,
		'violet': 0xEE82EE, 'wheat': 0xF5DEB3, 'white': 0xFFFFFF, 'whitesmoke': 0xF5F5F5, 'yellow': 0xFFFF00, 'yellowgreen': 0x9ACD32 };

	function Color( r, g, b ) {

		if ( g === undefined && b === undefined ) {

			// r is THREE.Color, hex or string
			return this.set( r );

		}

		return this.setRGB( r, g, b );

	}

	Object.assign( Color.prototype, {

		isColor: true,

		r: 1, g: 1, b: 1,

		set: function ( value ) {

			if ( value && value.isColor ) {

				this.copy( value );

			} else if ( typeof value === 'number' ) {

				this.setHex( value );

			} else if ( typeof value === 'string' ) {

				this.setStyle( value );

			}

			return this;

		},

		setScalar: function ( scalar ) {

			this.r = scalar;
			this.g = scalar;
			this.b = scalar;

			return this;

		},

		setHex: function ( hex ) {

			hex = Math.floor( hex );

			this.r = ( hex >> 16 & 255 ) / 255;
			this.g = ( hex >> 8 & 255 ) / 255;
			this.b = ( hex & 255 ) / 255;

			return this;

		},

		setRGB: function ( r, g, b ) {

			this.r = r;
			this.g = g;
			this.b = b;

			return this;

		},

		setHSL: function () {

			function hue2rgb( p, q, t ) {

				if ( t < 0 ) t += 1;
				if ( t > 1 ) t -= 1;
				if ( t < 1 / 6 ) return p + ( q - p ) * 6 * t;
				if ( t < 1 / 2 ) return q;
				if ( t < 2 / 3 ) return p + ( q - p ) * 6 * ( 2 / 3 - t );
				return p;

			}

			return function setHSL( h, s, l ) {

				// h,s,l ranges are in 0.0 - 1.0
				h = _Math.euclideanModulo( h, 1 );
				s = _Math.clamp( s, 0, 1 );
				l = _Math.clamp( l, 0, 1 );

				if ( s === 0 ) {

					this.r = this.g = this.b = l;

				} else {

					var p = l <= 0.5 ? l * ( 1 + s ) : l + s - ( l * s );
					var q = ( 2 * l ) - p;

					this.r = hue2rgb( q, p, h + 1 / 3 );
					this.g = hue2rgb( q, p, h );
					this.b = hue2rgb( q, p, h - 1 / 3 );

				}

				return this;

			};

		}(),

		setStyle: function ( style ) {

			function handleAlpha( string ) {

				if ( string === undefined ) return;

				if ( parseFloat( string ) < 1 ) {

					console.warn( 'THREE.Color: Alpha component of ' + style + ' will be ignored.' );

				}

			}


			var m;

			if ( m = /^((?:rgb|hsl)a?)\(\s*([^\)]*)\)/.exec( style ) ) {

				// rgb / hsl

				var color;
				var name = m[ 1 ];
				var components = m[ 2 ];

				switch ( name ) {

					case 'rgb':
					case 'rgba':

						if ( color = /^(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(,\s*([0-9]*\.?[0-9]+)\s*)?$/.exec( components ) ) {

							// rgb(255,0,0) rgba(255,0,0,0.5)
							this.r = Math.min( 255, parseInt( color[ 1 ], 10 ) ) / 255;
							this.g = Math.min( 255, parseInt( color[ 2 ], 10 ) ) / 255;
							this.b = Math.min( 255, parseInt( color[ 3 ], 10 ) ) / 255;

							handleAlpha( color[ 5 ] );

							return this;

						}

						if ( color = /^(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(,\s*([0-9]*\.?[0-9]+)\s*)?$/.exec( components ) ) {

							// rgb(100%,0%,0%) rgba(100%,0%,0%,0.5)
							this.r = Math.min( 100, parseInt( color[ 1 ], 10 ) ) / 100;
							this.g = Math.min( 100, parseInt( color[ 2 ], 10 ) ) / 100;
							this.b = Math.min( 100, parseInt( color[ 3 ], 10 ) ) / 100;

							handleAlpha( color[ 5 ] );

							return this;

						}

						break;

					case 'hsl':
					case 'hsla':

						if ( color = /^([0-9]*\.?[0-9]+)\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(,\s*([0-9]*\.?[0-9]+)\s*)?$/.exec( components ) ) {

							// hsl(120,50%,50%) hsla(120,50%,50%,0.5)
							var h = parseFloat( color[ 1 ] ) / 360;
							var s = parseInt( color[ 2 ], 10 ) / 100;
							var l = parseInt( color[ 3 ], 10 ) / 100;

							handleAlpha( color[ 5 ] );

							return this.setHSL( h, s, l );

						}

						break;

				}

			} else if ( m = /^\#([A-Fa-f0-9]+)$/.exec( style ) ) {

				// hex color

				var hex = m[ 1 ];
				var size = hex.length;

				if ( size === 3 ) {

					// #ff0
					this.r = parseInt( hex.charAt( 0 ) + hex.charAt( 0 ), 16 ) / 255;
					this.g = parseInt( hex.charAt( 1 ) + hex.charAt( 1 ), 16 ) / 255;
					this.b = parseInt( hex.charAt( 2 ) + hex.charAt( 2 ), 16 ) / 255;

					return this;

				} else if ( size === 6 ) {

					// #ff0000
					this.r = parseInt( hex.charAt( 0 ) + hex.charAt( 1 ), 16 ) / 255;
					this.g = parseInt( hex.charAt( 2 ) + hex.charAt( 3 ), 16 ) / 255;
					this.b = parseInt( hex.charAt( 4 ) + hex.charAt( 5 ), 16 ) / 255;

					return this;

				}

			}

			if ( style && style.length > 0 ) {

				// color keywords
				var hex = ColorKeywords[ style ];

				if ( hex !== undefined ) {

					// red
					this.setHex( hex );

				} else {

					// unknown color
					console.warn( 'THREE.Color: Unknown color ' + style );

				}

			}

			return this;

		},

		clone: function () {

			return new this.constructor( this.r, this.g, this.b );

		},

		copy: function ( color ) {

			this.r = color.r;
			this.g = color.g;
			this.b = color.b;

			return this;

		},

		copyGammaToLinear: function ( color, gammaFactor ) {

			if ( gammaFactor === undefined ) gammaFactor = 2.0;

			this.r = Math.pow( color.r, gammaFactor );
			this.g = Math.pow( color.g, gammaFactor );
			this.b = Math.pow( color.b, gammaFactor );

			return this;

		},

		copyLinearToGamma: function ( color, gammaFactor ) {

			if ( gammaFactor === undefined ) gammaFactor = 2.0;

			var safeInverse = ( gammaFactor > 0 ) ? ( 1.0 / gammaFactor ) : 1.0;

			this.r = Math.pow( color.r, safeInverse );
			this.g = Math.pow( color.g, safeInverse );
			this.b = Math.pow( color.b, safeInverse );

			return this;

		},

		convertGammaToLinear: function () {

			var r = this.r, g = this.g, b = this.b;

			this.r = r * r;
			this.g = g * g;
			this.b = b * b;

			return this;

		},

		convertLinearToGamma: function () {

			this.r = Math.sqrt( this.r );
			this.g = Math.sqrt( this.g );
			this.b = Math.sqrt( this.b );

			return this;

		},

		getHex: function () {

			return ( this.r * 255 ) << 16 ^ ( this.g * 255 ) << 8 ^ ( this.b * 255 ) << 0;

		},

		getHexString: function () {

			return ( '000000' + this.getHex().toString( 16 ) ).slice( - 6 );

		},

		getHSL: function ( optionalTarget ) {

			// h,s,l ranges are in 0.0 - 1.0

			var hsl = optionalTarget || { h: 0, s: 0, l: 0 };

			var r = this.r, g = this.g, b = this.b;

			var max = Math.max( r, g, b );
			var min = Math.min( r, g, b );

			var hue, saturation;
			var lightness = ( min + max ) / 2.0;

			if ( min === max ) {

				hue = 0;
				saturation = 0;

			} else {

				var delta = max - min;

				saturation = lightness <= 0.5 ? delta / ( max + min ) : delta / ( 2 - max - min );

				switch ( max ) {

					case r: hue = ( g - b ) / delta + ( g < b ? 6 : 0 ); break;
					case g: hue = ( b - r ) / delta + 2; break;
					case b: hue = ( r - g ) / delta + 4; break;

				}

				hue /= 6;

			}

			hsl.h = hue;
			hsl.s = saturation;
			hsl.l = lightness;

			return hsl;

		},

		getStyle: function () {

			return 'rgb(' + ( ( this.r * 255 ) | 0 ) + ',' + ( ( this.g * 255 ) | 0 ) + ',' + ( ( this.b * 255 ) | 0 ) + ')';

		},

		offsetHSL: function ( h, s, l ) {

			var hsl = this.getHSL();

			hsl.h += h; hsl.s += s; hsl.l += l;

			this.setHSL( hsl.h, hsl.s, hsl.l );

			return this;

		},

		add: function ( color ) {

			this.r += color.r;
			this.g += color.g;
			this.b += color.b;

			return this;

		},

		addColors: function ( color1, color2 ) {

			this.r = color1.r + color2.r;
			this.g = color1.g + color2.g;
			this.b = color1.b + color2.b;

			return this;

		},

		addScalar: function ( s ) {

			this.r += s;
			this.g += s;
			this.b += s;

			return this;

		},

		sub: function ( color ) {

			this.r = Math.max( 0, this.r - color.r );
			this.g = Math.max( 0, this.g - color.g );
			this.b = Math.max( 0, this.b - color.b );

			return this;

		},

		multiply: function ( color ) {

			this.r *= color.r;
			this.g *= color.g;
			this.b *= color.b;

			return this;

		},

		multiplyScalar: function ( s ) {

			this.r *= s;
			this.g *= s;
			this.b *= s;

			return this;

		},

		lerp: function ( color, alpha ) {

			this.r += ( color.r - this.r ) * alpha;
			this.g += ( color.g - this.g ) * alpha;
			this.b += ( color.b - this.b ) * alpha;

			return this;

		},

		equals: function ( c ) {

			return ( c.r === this.r ) && ( c.g === this.g ) && ( c.b === this.b );

		},

		fromArray: function ( array, offset ) {

			if ( offset === undefined ) offset = 0;

			this.r = array[ offset ];
			this.g = array[ offset + 1 ];
			this.b = array[ offset + 2 ];

			return this;

		},

		toArray: function ( array, offset ) {

			if ( array === undefined ) array = [];
			if ( offset === undefined ) offset = 0;

			array[ offset ] = this.r;
			array[ offset + 1 ] = this.g;
			array[ offset + 2 ] = this.b;

			return array;

		},

		toJSON: function () {

			return this.getHex();

		}

	} );

	/**
	 * @author mrdoob / http://mrdoob.com/
	 * @author supereggbert / http://www.paulbrunt.co.uk/
	 * @author philogb / http://blog.thejit.org/
	 * @author jordi_ros / http://plattsoft.com
	 * @author D1plo1d / http://github.com/D1plo1d
	 * @author alteredq / http://alteredqualia.com/
	 * @author mikael emtinger / http://gomo.se/
	 * @author timknip / http://www.floorplanner.com/
	 * @author bhouston / http://clara.io
	 * @author WestLangley / http://github.com/WestLangley
	 */

	function Matrix4() {

		this.elements = [

			1, 0, 0, 0,
			0, 1, 0, 0,
			0, 0, 1, 0,
			0, 0, 0, 1

		];

		if ( arguments.length > 0 ) {

			console.error( 'THREE.Matrix4: the constructor no longer reads arguments. use .set() instead.' );

		}

	}

	Object.assign( Matrix4.prototype, {

		isMatrix4: true,

		set: function ( n11, n12, n13, n14, n21, n22, n23, n24, n31, n32, n33, n34, n41, n42, n43, n44 ) {

			var te = this.elements;

			te[ 0 ] = n11; te[ 4 ] = n12; te[ 8 ] = n13; te[ 12 ] = n14;
			te[ 1 ] = n21; te[ 5 ] = n22; te[ 9 ] = n23; te[ 13 ] = n24;
			te[ 2 ] = n31; te[ 6 ] = n32; te[ 10 ] = n33; te[ 14 ] = n34;
			te[ 3 ] = n41; te[ 7 ] = n42; te[ 11 ] = n43; te[ 15 ] = n44;

			return this;

		},

		identity: function () {

			this.set(

				1, 0, 0, 0,
				0, 1, 0, 0,
				0, 0, 1, 0,
				0, 0, 0, 1

			);

			return this;

		},

		clone: function () {

			return new Matrix4().fromArray( this.elements );

		},

		copy: function ( m ) {

			var te = this.elements;
			var me = m.elements;

			te[ 0 ] = me[ 0 ]; te[ 1 ] = me[ 1 ]; te[ 2 ] = me[ 2 ]; te[ 3 ] = me[ 3 ];
			te[ 4 ] = me[ 4 ]; te[ 5 ] = me[ 5 ]; te[ 6 ] = me[ 6 ]; te[ 7 ] = me[ 7 ];
			te[ 8 ] = me[ 8 ]; te[ 9 ] = me[ 9 ]; te[ 10 ] = me[ 10 ]; te[ 11 ] = me[ 11 ];
			te[ 12 ] = me[ 12 ]; te[ 13 ] = me[ 13 ]; te[ 14 ] = me[ 14 ]; te[ 15 ] = me[ 15 ];

			return this;

		},

		copyPosition: function ( m ) {

			var te = this.elements, me = m.elements;

			te[ 12 ] = me[ 12 ];
			te[ 13 ] = me[ 13 ];
			te[ 14 ] = me[ 14 ];

			return this;

		},

		extractBasis: function ( xAxis, yAxis, zAxis ) {

			xAxis.setFromMatrixColumn( this, 0 );
			yAxis.setFromMatrixColumn( this, 1 );
			zAxis.setFromMatrixColumn( this, 2 );

			return this;

		},

		makeBasis: function ( xAxis, yAxis, zAxis ) {

			this.set(
				xAxis.x, yAxis.x, zAxis.x, 0,
				xAxis.y, yAxis.y, zAxis.y, 0,
				xAxis.z, yAxis.z, zAxis.z, 0,
				0, 0, 0, 1
			);

			return this;

		},

		extractRotation: function () {

			var v1 = new Vector3();

			return function extractRotation( m ) {

				var te = this.elements;
				var me = m.elements;

				var scaleX = 1 / v1.setFromMatrixColumn( m, 0 ).length();
				var scaleY = 1 / v1.setFromMatrixColumn( m, 1 ).length();
				var scaleZ = 1 / v1.setFromMatrixColumn( m, 2 ).length();

				te[ 0 ] = me[ 0 ] * scaleX;
				te[ 1 ] = me[ 1 ] * scaleX;
				te[ 2 ] = me[ 2 ] * scaleX;

				te[ 4 ] = me[ 4 ] * scaleY;
				te[ 5 ] = me[ 5 ] * scaleY;
				te[ 6 ] = me[ 6 ] * scaleY;

				te[ 8 ] = me[ 8 ] * scaleZ;
				te[ 9 ] = me[ 9 ] * scaleZ;
				te[ 10 ] = me[ 10 ] * scaleZ;

				return this;

			};

		}(),

		makeRotationFromEuler: function ( euler ) {

			if ( ! ( euler && euler.isEuler ) ) {

				console.error( 'THREE.Matrix4: .makeRotationFromEuler() now expects a Euler rotation rather than a Vector3 and order.' );

			}

			var te = this.elements;

			var x = euler.x, y = euler.y, z = euler.z;
			var a = Math.cos( x ), b = Math.sin( x );
			var c = Math.cos( y ), d = Math.sin( y );
			var e = Math.cos( z ), f = Math.sin( z );

			if ( euler.order === 'XYZ' ) {

				var ae = a * e, af = a * f, be = b * e, bf = b * f;

				te[ 0 ] = c * e;
				te[ 4 ] = - c * f;
				te[ 8 ] = d;

				te[ 1 ] = af + be * d;
				te[ 5 ] = ae - bf * d;
				te[ 9 ] = - b * c;

				te[ 2 ] = bf - ae * d;
				te[ 6 ] = be + af * d;
				te[ 10 ] = a * c;

			} else if ( euler.order === 'YXZ' ) {

				var ce = c * e, cf = c * f, de = d * e, df = d * f;

				te[ 0 ] = ce + df * b;
				te[ 4 ] = de * b - cf;
				te[ 8 ] = a * d;

				te[ 1 ] = a * f;
				te[ 5 ] = a * e;
				te[ 9 ] = - b;

				te[ 2 ] = cf * b - de;
				te[ 6 ] = df + ce * b;
				te[ 10 ] = a * c;

			} else if ( euler.order === 'ZXY' ) {

				var ce = c * e, cf = c * f, de = d * e, df = d * f;

				te[ 0 ] = ce - df * b;
				te[ 4 ] = - a * f;
				te[ 8 ] = de + cf * b;

				te[ 1 ] = cf + de * b;
				te[ 5 ] = a * e;
				te[ 9 ] = df - ce * b;

				te[ 2 ] = - a * d;
				te[ 6 ] = b;
				te[ 10 ] = a * c;

			} else if ( euler.order === 'ZYX' ) {

				var ae = a * e, af = a * f, be = b * e, bf = b * f;

				te[ 0 ] = c * e;
				te[ 4 ] = be * d - af;
				te[ 8 ] = ae * d + bf;

				te[ 1 ] = c * f;
				te[ 5 ] = bf * d + ae;
				te[ 9 ] = af * d - be;

				te[ 2 ] = - d;
				te[ 6 ] = b * c;
				te[ 10 ] = a * c;

			} else if ( euler.order === 'YZX' ) {

				var ac = a * c, ad = a * d, bc = b * c, bd = b * d;

				te[ 0 ] = c * e;
				te[ 4 ] = bd - ac * f;
				te[ 8 ] = bc * f + ad;

				te[ 1 ] = f;
				te[ 5 ] = a * e;
				te[ 9 ] = - b * e;

				te[ 2 ] = - d * e;
				te[ 6 ] = ad * f + bc;
				te[ 10 ] = ac - bd * f;

			} else if ( euler.order === 'XZY' ) {

				var ac = a * c, ad = a * d, bc = b * c, bd = b * d;

				te[ 0 ] = c * e;
				te[ 4 ] = - f;
				te[ 8 ] = d * e;

				te[ 1 ] = ac * f + bd;
				te[ 5 ] = a * e;
				te[ 9 ] = ad * f - bc;

				te[ 2 ] = bc * f - ad;
				te[ 6 ] = b * e;
				te[ 10 ] = bd * f + ac;

			}

			// last column
			te[ 3 ] = 0;
			te[ 7 ] = 0;
			te[ 11 ] = 0;

			// bottom row
			te[ 12 ] = 0;
			te[ 13 ] = 0;
			te[ 14 ] = 0;
			te[ 15 ] = 1;

			return this;

		},

		makeRotationFromQuaternion: function ( q ) {

			var te = this.elements;

			var x = q._x, y = q._y, z = q._z, w = q._w;
			var x2 = x + x, y2 = y + y, z2 = z + z;
			var xx = x * x2, xy = x * y2, xz = x * z2;
			var yy = y * y2, yz = y * z2, zz = z * z2;
			var wx = w * x2, wy = w * y2, wz = w * z2;

			te[ 0 ] = 1 - ( yy + zz );
			te[ 4 ] = xy - wz;
			te[ 8 ] = xz + wy;

			te[ 1 ] = xy + wz;
			te[ 5 ] = 1 - ( xx + zz );
			te[ 9 ] = yz - wx;

			te[ 2 ] = xz - wy;
			te[ 6 ] = yz + wx;
			te[ 10 ] = 1 - ( xx + yy );

			// last column
			te[ 3 ] = 0;
			te[ 7 ] = 0;
			te[ 11 ] = 0;

			// bottom row
			te[ 12 ] = 0;
			te[ 13 ] = 0;
			te[ 14 ] = 0;
			te[ 15 ] = 1;

			return this;

		},

		lookAt: function () {

			var x = new Vector3();
			var y = new Vector3();
			var z = new Vector3();

			return function lookAt( eye, target, up ) {

				var te = this.elements;

				z.subVectors( eye, target );

				if ( z.lengthSq() === 0 ) {

					// eye and target are in the same position

					z.z = 1;

				}

				z.normalize();
				x.crossVectors( up, z );

				if ( x.lengthSq() === 0 ) {

					// up and z are parallel

					if ( Math.abs( up.z ) === 1 ) {

						z.x += 0.0001;

					} else {

						z.z += 0.0001;

					}

					z.normalize();
					x.crossVectors( up, z );

				}

				x.normalize();
				y.crossVectors( z, x );

				te[ 0 ] = x.x; te[ 4 ] = y.x; te[ 8 ] = z.x;
				te[ 1 ] = x.y; te[ 5 ] = y.y; te[ 9 ] = z.y;
				te[ 2 ] = x.z; te[ 6 ] = y.z; te[ 10 ] = z.z;

				return this;

			};

		}(),

		multiply: function ( m, n ) {

			if ( n !== undefined ) {

				console.warn( 'THREE.Matrix4: .multiply() now only accepts one argument. Use .multiplyMatrices( a, b ) instead.' );
				return this.multiplyMatrices( m, n );

			}

			return this.multiplyMatrices( this, m );

		},

		premultiply: function ( m ) {

			return this.multiplyMatrices( m, this );

		},

		multiplyMatrices: function ( a, b ) {

			var ae = a.elements;
			var be = b.elements;
			var te = this.elements;

			var a11 = ae[ 0 ], a12 = ae[ 4 ], a13 = ae[ 8 ], a14 = ae[ 12 ];
			var a21 = ae[ 1 ], a22 = ae[ 5 ], a23 = ae[ 9 ], a24 = ae[ 13 ];
			var a31 = ae[ 2 ], a32 = ae[ 6 ], a33 = ae[ 10 ], a34 = ae[ 14 ];
			var a41 = ae[ 3 ], a42 = ae[ 7 ], a43 = ae[ 11 ], a44 = ae[ 15 ];

			var b11 = be[ 0 ], b12 = be[ 4 ], b13 = be[ 8 ], b14 = be[ 12 ];
			var b21 = be[ 1 ], b22 = be[ 5 ], b23 = be[ 9 ], b24 = be[ 13 ];
			var b31 = be[ 2 ], b32 = be[ 6 ], b33 = be[ 10 ], b34 = be[ 14 ];
			var b41 = be[ 3 ], b42 = be[ 7 ], b43 = be[ 11 ], b44 = be[ 15 ];

			te[ 0 ] = a11 * b11 + a12 * b21 + a13 * b31 + a14 * b41;
			te[ 4 ] = a11 * b12 + a12 * b22 + a13 * b32 + a14 * b42;
			te[ 8 ] = a11 * b13 + a12 * b23 + a13 * b33 + a14 * b43;
			te[ 12 ] = a11 * b14 + a12 * b24 + a13 * b34 + a14 * b44;

			te[ 1 ] = a21 * b11 + a22 * b21 + a23 * b31 + a24 * b41;
			te[ 5 ] = a21 * b12 + a22 * b22 + a23 * b32 + a24 * b42;
			te[ 9 ] = a21 * b13 + a22 * b23 + a23 * b33 + a24 * b43;
			te[ 13 ] = a21 * b14 + a22 * b24 + a23 * b34 + a24 * b44;

			te[ 2 ] = a31 * b11 + a32 * b21 + a33 * b31 + a34 * b41;
			te[ 6 ] = a31 * b12 + a32 * b22 + a33 * b32 + a34 * b42;
			te[ 10 ] = a31 * b13 + a32 * b23 + a33 * b33 + a34 * b43;
			te[ 14 ] = a31 * b14 + a32 * b24 + a33 * b34 + a34 * b44;

			te[ 3 ] = a41 * b11 + a42 * b21 + a43 * b31 + a44 * b41;
			te[ 7 ] = a41 * b12 + a42 * b22 + a43 * b32 + a44 * b42;
			te[ 11 ] = a41 * b13 + a42 * b23 + a43 * b33 + a44 * b43;
			te[ 15 ] = a41 * b14 + a42 * b24 + a43 * b34 + a44 * b44;

			return this;

		},

		multiplyScalar: function ( s ) {

			var te = this.elements;

			te[ 0 ] *= s; te[ 4 ] *= s; te[ 8 ] *= s; te[ 12 ] *= s;
			te[ 1 ] *= s; te[ 5 ] *= s; te[ 9 ] *= s; te[ 13 ] *= s;
			te[ 2 ] *= s; te[ 6 ] *= s; te[ 10 ] *= s; te[ 14 ] *= s;
			te[ 3 ] *= s; te[ 7 ] *= s; te[ 11 ] *= s; te[ 15 ] *= s;

			return this;

		},

		applyToBufferAttribute: function () {

			var v1 = new Vector3();

			return function applyToBufferAttribute( attribute ) {

				for ( var i = 0, l = attribute.count; i < l; i ++ ) {

					v1.x = attribute.getX( i );
					v1.y = attribute.getY( i );
					v1.z = attribute.getZ( i );

					v1.applyMatrix4( this );

					attribute.setXYZ( i, v1.x, v1.y, v1.z );

				}

				return attribute;

			};

		}(),

		determinant: function () {

			var te = this.elements;

			var n11 = te[ 0 ], n12 = te[ 4 ], n13 = te[ 8 ], n14 = te[ 12 ];
			var n21 = te[ 1 ], n22 = te[ 5 ], n23 = te[ 9 ], n24 = te[ 13 ];
			var n31 = te[ 2 ], n32 = te[ 6 ], n33 = te[ 10 ], n34 = te[ 14 ];
			var n41 = te[ 3 ], n42 = te[ 7 ], n43 = te[ 11 ], n44 = te[ 15 ];

			//TODO: make this more efficient
			//( based on http://www.euclideanspace.com/maths/algebra/matrix/functions/inverse/fourD/index.htm )

			return (
				n41 * (
					+ n14 * n23 * n32
					 - n13 * n24 * n32
					 - n14 * n22 * n33
					 + n12 * n24 * n33
					 + n13 * n22 * n34
					 - n12 * n23 * n34
				) +
				n42 * (
					+ n11 * n23 * n34
					 - n11 * n24 * n33
					 + n14 * n21 * n33
					 - n13 * n21 * n34
					 + n13 * n24 * n31
					 - n14 * n23 * n31
				) +
				n43 * (
					+ n11 * n24 * n32
					 - n11 * n22 * n34
					 - n14 * n21 * n32
					 + n12 * n21 * n34
					 + n14 * n22 * n31
					 - n12 * n24 * n31
				) +
				n44 * (
					- n13 * n22 * n31
					 - n11 * n23 * n32
					 + n11 * n22 * n33
					 + n13 * n21 * n32
					 - n12 * n21 * n33
					 + n12 * n23 * n31
				)

			);

		},

		transpose: function () {

			var te = this.elements;
			var tmp;

			tmp = te[ 1 ]; te[ 1 ] = te[ 4 ]; te[ 4 ] = tmp;
			tmp = te[ 2 ]; te[ 2 ] = te[ 8 ]; te[ 8 ] = tmp;
			tmp = te[ 6 ]; te[ 6 ] = te[ 9 ]; te[ 9 ] = tmp;

			tmp = te[ 3 ]; te[ 3 ] = te[ 12 ]; te[ 12 ] = tmp;
			tmp = te[ 7 ]; te[ 7 ] = te[ 13 ]; te[ 13 ] = tmp;
			tmp = te[ 11 ]; te[ 11 ] = te[ 14 ]; te[ 14 ] = tmp;

			return this;

		},

		setPosition: function ( v ) {

			var te = this.elements;

			te[ 12 ] = v.x;
			te[ 13 ] = v.y;
			te[ 14 ] = v.z;

			return this;

		},

		getInverse: function ( m, throwOnDegenerate ) {

			// based on http://www.euclideanspace.com/maths/algebra/matrix/functions/inverse/fourD/index.htm
			var te = this.elements,
				me = m.elements,

				n11 = me[ 0 ], n21 = me[ 1 ], n31 = me[ 2 ], n41 = me[ 3 ],
				n12 = me[ 4 ], n22 = me[ 5 ], n32 = me[ 6 ], n42 = me[ 7 ],
				n13 = me[ 8 ], n23 = me[ 9 ], n33 = me[ 10 ], n43 = me[ 11 ],
				n14 = me[ 12 ], n24 = me[ 13 ], n34 = me[ 14 ], n44 = me[ 15 ],

				t11 = n23 * n34 * n42 - n24 * n33 * n42 + n24 * n32 * n43 - n22 * n34 * n43 - n23 * n32 * n44 + n22 * n33 * n44,
				t12 = n14 * n33 * n42 - n13 * n34 * n42 - n14 * n32 * n43 + n12 * n34 * n43 + n13 * n32 * n44 - n12 * n33 * n44,
				t13 = n13 * n24 * n42 - n14 * n23 * n42 + n14 * n22 * n43 - n12 * n24 * n43 - n13 * n22 * n44 + n12 * n23 * n44,
				t14 = n14 * n23 * n32 - n13 * n24 * n32 - n14 * n22 * n33 + n12 * n24 * n33 + n13 * n22 * n34 - n12 * n23 * n34;

			var det = n11 * t11 + n21 * t12 + n31 * t13 + n41 * t14;

			if ( det === 0 ) {

				var msg = "THREE.Matrix4: .getInverse() can't invert matrix, determinant is 0";

				if ( throwOnDegenerate === true ) {

					throw new Error( msg );

				} else {

					console.warn( msg );

				}

				return this.identity();

			}

			var detInv = 1 / det;

			te[ 0 ] = t11 * detInv;
			te[ 1 ] = ( n24 * n33 * n41 - n23 * n34 * n41 - n24 * n31 * n43 + n21 * n34 * n43 + n23 * n31 * n44 - n21 * n33 * n44 ) * detInv;
			te[ 2 ] = ( n22 * n34 * n41 - n24 * n32 * n41 + n24 * n31 * n42 - n21 * n34 * n42 - n22 * n31 * n44 + n21 * n32 * n44 ) * detInv;
			te[ 3 ] = ( n23 * n32 * n41 - n22 * n33 * n41 - n23 * n31 * n42 + n21 * n33 * n42 + n22 * n31 * n43 - n21 * n32 * n43 ) * detInv;

			te[ 4 ] = t12 * detInv;
			te[ 5 ] = ( n13 * n34 * n41 - n14 * n33 * n41 + n14 * n31 * n43 - n11 * n34 * n43 - n13 * n31 * n44 + n11 * n33 * n44 ) * detInv;
			te[ 6 ] = ( n14 * n32 * n41 - n12 * n34 * n41 - n14 * n31 * n42 + n11 * n34 * n42 + n12 * n31 * n44 - n11 * n32 * n44 ) * detInv;
			te[ 7 ] = ( n12 * n33 * n41 - n13 * n32 * n41 + n13 * n31 * n42 - n11 * n33 * n42 - n12 * n31 * n43 + n11 * n32 * n43 ) * detInv;

			te[ 8 ] = t13 * detInv;
			te[ 9 ] = ( n14 * n23 * n41 - n13 * n24 * n41 - n14 * n21 * n43 + n11 * n24 * n43 + n13 * n21 * n44 - n11 * n23 * n44 ) * detInv;
			te[ 10 ] = ( n12 * n24 * n41 - n14 * n22 * n41 + n14 * n21 * n42 - n11 * n24 * n42 - n12 * n21 * n44 + n11 * n22 * n44 ) * detInv;
			te[ 11 ] = ( n13 * n22 * n41 - n12 * n23 * n41 - n13 * n21 * n42 + n11 * n23 * n42 + n12 * n21 * n43 - n11 * n22 * n43 ) * detInv;

			te[ 12 ] = t14 * detInv;
			te[ 13 ] = ( n13 * n24 * n31 - n14 * n23 * n31 + n14 * n21 * n33 - n11 * n24 * n33 - n13 * n21 * n34 + n11 * n23 * n34 ) * detInv;
			te[ 14 ] = ( n14 * n22 * n31 - n12 * n24 * n31 - n14 * n21 * n32 + n11 * n24 * n32 + n12 * n21 * n34 - n11 * n22 * n34 ) * detInv;
			te[ 15 ] = ( n12 * n23 * n31 - n13 * n22 * n31 + n13 * n21 * n32 - n11 * n23 * n32 - n12 * n21 * n33 + n11 * n22 * n33 ) * detInv;

			return this;

		},

		scale: function ( v ) {

			var te = this.elements;
			var x = v.x, y = v.y, z = v.z;

			te[ 0 ] *= x; te[ 4 ] *= y; te[ 8 ] *= z;
			te[ 1 ] *= x; te[ 5 ] *= y; te[ 9 ] *= z;
			te[ 2 ] *= x; te[ 6 ] *= y; te[ 10 ] *= z;
			te[ 3 ] *= x; te[ 7 ] *= y; te[ 11 ] *= z;

			return this;

		},

		getMaxScaleOnAxis: function () {

			var te = this.elements;

			var scaleXSq = te[ 0 ] * te[ 0 ] + te[ 1 ] * te[ 1 ] + te[ 2 ] * te[ 2 ];
			var scaleYSq = te[ 4 ] * te[ 4 ] + te[ 5 ] * te[ 5 ] + te[ 6 ] * te[ 6 ];
			var scaleZSq = te[ 8 ] * te[ 8 ] + te[ 9 ] * te[ 9 ] + te[ 10 ] * te[ 10 ];

			return Math.sqrt( Math.max( scaleXSq, scaleYSq, scaleZSq ) );

		},

		makeTranslation: function ( x, y, z ) {

			this.set(

				1, 0, 0, x,
				0, 1, 0, y,
				0, 0, 1, z,
				0, 0, 0, 1

			);

			return this;

		},

		makeRotationX: function ( theta ) {

			var c = Math.cos( theta ), s = Math.sin( theta );

			this.set(

				1, 0, 0, 0,
				0, c, - s, 0,
				0, s, c, 0,
				0, 0, 0, 1

			);

			return this;

		},

		makeRotationY: function ( theta ) {

			var c = Math.cos( theta ), s = Math.sin( theta );

			this.set(

				 c, 0, s, 0,
				 0, 1, 0, 0,
				- s, 0, c, 0,
				 0, 0, 0, 1

			);

			return this;

		},

		makeRotationZ: function ( theta ) {

			var c = Math.cos( theta ), s = Math.sin( theta );

			this.set(

				c, - s, 0, 0,
				s, c, 0, 0,
				0, 0, 1, 0,
				0, 0, 0, 1

			);

			return this;

		},

		makeRotationAxis: function ( axis, angle ) {

			// Based on http://www.gamedev.net/reference/articles/article1199.asp

			var c = Math.cos( angle );
			var s = Math.sin( angle );
			var t = 1 - c;
			var x = axis.x, y = axis.y, z = axis.z;
			var tx = t * x, ty = t * y;

			this.set(

				tx * x + c, tx * y - s * z, tx * z + s * y, 0,
				tx * y + s * z, ty * y + c, ty * z - s * x, 0,
				tx * z - s * y, ty * z + s * x, t * z * z + c, 0,
				0, 0, 0, 1

			);

			 return this;

		},

		makeScale: function ( x, y, z ) {

			this.set(

				x, 0, 0, 0,
				0, y, 0, 0,
				0, 0, z, 0,
				0, 0, 0, 1

			);

			return this;

		},

		makeShear: function ( x, y, z ) {

			this.set(

				1, y, z, 0,
				x, 1, z, 0,
				x, y, 1, 0,
				0, 0, 0, 1

			);

			return this;

		},

		compose: function ( position, quaternion, scale ) {

			this.makeRotationFromQuaternion( quaternion );
			this.scale( scale );
			this.setPosition( position );

			return this;

		},

		decompose: function () {

			var vector = new Vector3();
			var matrix = new Matrix4();

			return function decompose( position, quaternion, scale ) {

				var te = this.elements;

				var sx = vector.set( te[ 0 ], te[ 1 ], te[ 2 ] ).length();
				var sy = vector.set( te[ 4 ], te[ 5 ], te[ 6 ] ).length();
				var sz = vector.set( te[ 8 ], te[ 9 ], te[ 10 ] ).length();

				// if determine is negative, we need to invert one scale
				var det = this.determinant();
				if ( det < 0 ) sx = - sx;

				position.x = te[ 12 ];
				position.y = te[ 13 ];
				position.z = te[ 14 ];

				// scale the rotation part
				matrix.copy( this );

				var invSX = 1 / sx;
				var invSY = 1 / sy;
				var invSZ = 1 / sz;

				matrix.elements[ 0 ] *= invSX;
				matrix.elements[ 1 ] *= invSX;
				matrix.elements[ 2 ] *= invSX;

				matrix.elements[ 4 ] *= invSY;
				matrix.elements[ 5 ] *= invSY;
				matrix.elements[ 6 ] *= invSY;

				matrix.elements[ 8 ] *= invSZ;
				matrix.elements[ 9 ] *= invSZ;
				matrix.elements[ 10 ] *= invSZ;

				quaternion.setFromRotationMatrix( matrix );

				scale.x = sx;
				scale.y = sy;
				scale.z = sz;

				return this;

			};

		}(),

		makePerspective: function ( left, right, top, bottom, near, far ) {

			if ( far === undefined ) {

				console.warn( 'THREE.Matrix4: .makePerspective() has been redefined and has a new signature. Please check the docs.' );

			}

			var te = this.elements;
			var x = 2 * near / ( right - left );
			var y = 2 * near / ( top - bottom );

			var a = ( right + left ) / ( right - left );
			var b = ( top + bottom ) / ( top - bottom );
			var c = - ( far + near ) / ( far - near );
			var d = - 2 * far * near / ( far - near );

			te[ 0 ] = x;	te[ 4 ] = 0;	te[ 8 ] = a;	te[ 12 ] = 0;
			te[ 1 ] = 0;	te[ 5 ] = y;	te[ 9 ] = b;	te[ 13 ] = 0;
			te[ 2 ] = 0;	te[ 6 ] = 0;	te[ 10 ] = c;	te[ 14 ] = d;
			te[ 3 ] = 0;	te[ 7 ] = 0;	te[ 11 ] = - 1;	te[ 15 ] = 0;

			return this;

		},

		makeOrthographic: function ( left, right, top, bottom, near, far ) {

			var te = this.elements;
			var w = 1.0 / ( right - left );
			var h = 1.0 / ( top - bottom );
			var p = 1.0 / ( far - near );

			var x = ( right + left ) * w;
			var y = ( top + bottom ) * h;
			var z = ( far + near ) * p;

			te[ 0 ] = 2 * w;	te[ 4 ] = 0;	te[ 8 ] = 0;	te[ 12 ] = - x;
			te[ 1 ] = 0;	te[ 5 ] = 2 * h;	te[ 9 ] = 0;	te[ 13 ] = - y;
			te[ 2 ] = 0;	te[ 6 ] = 0;	te[ 10 ] = - 2 * p;	te[ 14 ] = - z;
			te[ 3 ] = 0;	te[ 7 ] = 0;	te[ 11 ] = 0;	te[ 15 ] = 1;

			return this;

		},

		equals: function ( matrix ) {

			var te = this.elements;
			var me = matrix.elements;

			for ( var i = 0; i < 16; i ++ ) {

				if ( te[ i ] !== me[ i ] ) return false;

			}

			return true;

		},

		fromArray: function ( array, offset ) {

			if ( offset === undefined ) offset = 0;

			for ( var i = 0; i < 16; i ++ ) {

				this.elements[ i ] = array[ i + offset ];

			}

			return this;

		},

		toArray: function ( array, offset ) {

			if ( array === undefined ) array = [];
			if ( offset === undefined ) offset = 0;

			var te = this.elements;

			array[ offset ] = te[ 0 ];
			array[ offset + 1 ] = te[ 1 ];
			array[ offset + 2 ] = te[ 2 ];
			array[ offset + 3 ] = te[ 3 ];

			array[ offset + 4 ] = te[ 4 ];
			array[ offset + 5 ] = te[ 5 ];
			array[ offset + 6 ] = te[ 6 ];
			array[ offset + 7 ] = te[ 7 ];

			array[ offset + 8 ] = te[ 8 ];
			array[ offset + 9 ] = te[ 9 ];
			array[ offset + 10 ] = te[ 10 ];
			array[ offset + 11 ] = te[ 11 ];

			array[ offset + 12 ] = te[ 12 ];
			array[ offset + 13 ] = te[ 13 ];
			array[ offset + 14 ] = te[ 14 ];
			array[ offset + 15 ] = te[ 15 ];

			return array;

		}

	} );

	/**
	 * @author mikael emtinger / http://gomo.se/
	 * @author alteredq / http://alteredqualia.com/
	 * @author WestLangley / http://github.com/WestLangley
	 * @author bhouston / http://clara.io
	 */

	function Quaternion( x, y, z, w ) {

		this._x = x || 0;
		this._y = y || 0;
		this._z = z || 0;
		this._w = ( w !== undefined ) ? w : 1;

	}

	Object.assign( Quaternion, {

		slerp: function ( qa, qb, qm, t ) {

			return qm.copy( qa ).slerp( qb, t );

		},

		slerpFlat: function ( dst, dstOffset, src0, srcOffset0, src1, srcOffset1, t ) {

			// fuzz-free, array-based Quaternion SLERP operation

			var x0 = src0[ srcOffset0 + 0 ],
				y0 = src0[ srcOffset0 + 1 ],
				z0 = src0[ srcOffset0 + 2 ],
				w0 = src0[ srcOffset0 + 3 ],

				x1 = src1[ srcOffset1 + 0 ],
				y1 = src1[ srcOffset1 + 1 ],
				z1 = src1[ srcOffset1 + 2 ],
				w1 = src1[ srcOffset1 + 3 ];

			if ( w0 !== w1 || x0 !== x1 || y0 !== y1 || z0 !== z1 ) {

				var s = 1 - t,

					cos = x0 * x1 + y0 * y1 + z0 * z1 + w0 * w1,

					dir = ( cos >= 0 ? 1 : - 1 ),
					sqrSin = 1 - cos * cos;

				// Skip the Slerp for tiny steps to avoid numeric problems:
				if ( sqrSin > Number.EPSILON ) {

					var sin = Math.sqrt( sqrSin ),
						len = Math.atan2( sin, cos * dir );

					s = Math.sin( s * len ) / sin;
					t = Math.sin( t * len ) / sin;

				}

				var tDir = t * dir;

				x0 = x0 * s + x1 * tDir;
				y0 = y0 * s + y1 * tDir;
				z0 = z0 * s + z1 * tDir;
				w0 = w0 * s + w1 * tDir;

				// Normalize in case we just did a lerp:
				if ( s === 1 - t ) {

					var f = 1 / Math.sqrt( x0 * x0 + y0 * y0 + z0 * z0 + w0 * w0 );

					x0 *= f;
					y0 *= f;
					z0 *= f;
					w0 *= f;

				}

			}

			dst[ dstOffset ] = x0;
			dst[ dstOffset + 1 ] = y0;
			dst[ dstOffset + 2 ] = z0;
			dst[ dstOffset + 3 ] = w0;

		}

	} );

	Object.defineProperties( Quaternion.prototype, {

		x: {

			get: function () {

				return this._x;

			},

			set: function ( value ) {

				this._x = value;
				this.onChangeCallback();

			}

		},

		y: {

			get: function () {

				return this._y;

			},

			set: function ( value ) {

				this._y = value;
				this.onChangeCallback();

			}

		},

		z: {

			get: function () {

				return this._z;

			},

			set: function ( value ) {

				this._z = value;
				this.onChangeCallback();

			}

		},

		w: {

			get: function () {

				return this._w;

			},

			set: function ( value ) {

				this._w = value;
				this.onChangeCallback();

			}

		}

	} );

	Object.assign( Quaternion.prototype, {

		set: function ( x, y, z, w ) {

			this._x = x;
			this._y = y;
			this._z = z;
			this._w = w;

			this.onChangeCallback();

			return this;

		},

		clone: function () {

			return new this.constructor( this._x, this._y, this._z, this._w );

		},

		copy: function ( quaternion ) {

			this._x = quaternion.x;
			this._y = quaternion.y;
			this._z = quaternion.z;
			this._w = quaternion.w;

			this.onChangeCallback();

			return this;

		},

		setFromEuler: function ( euler, update ) {

			if ( ! ( euler && euler.isEuler ) ) {

				throw new Error( 'THREE.Quaternion: .setFromEuler() now expects an Euler rotation rather than a Vector3 and order.' );

			}

			var x = euler._x, y = euler._y, z = euler._z, order = euler.order;

			// http://www.mathworks.com/matlabcentral/fileexchange/
			// 	20696-function-to-convert-between-dcm-euler-angles-quaternions-and-euler-vectors/
			//	content/SpinCalc.m

			var cos = Math.cos;
			var sin = Math.sin;

			var c1 = cos( x / 2 );
			var c2 = cos( y / 2 );
			var c3 = cos( z / 2 );

			var s1 = sin( x / 2 );
			var s2 = sin( y / 2 );
			var s3 = sin( z / 2 );

			if ( order === 'XYZ' ) {

				this._x = s1 * c2 * c3 + c1 * s2 * s3;
				this._y = c1 * s2 * c3 - s1 * c2 * s3;
				this._z = c1 * c2 * s3 + s1 * s2 * c3;
				this._w = c1 * c2 * c3 - s1 * s2 * s3;

			} else if ( order === 'YXZ' ) {

				this._x = s1 * c2 * c3 + c1 * s2 * s3;
				this._y = c1 * s2 * c3 - s1 * c2 * s3;
				this._z = c1 * c2 * s3 - s1 * s2 * c3;
				this._w = c1 * c2 * c3 + s1 * s2 * s3;

			} else if ( order === 'ZXY' ) {

				this._x = s1 * c2 * c3 - c1 * s2 * s3;
				this._y = c1 * s2 * c3 + s1 * c2 * s3;
				this._z = c1 * c2 * s3 + s1 * s2 * c3;
				this._w = c1 * c2 * c3 - s1 * s2 * s3;

			} else if ( order === 'ZYX' ) {

				this._x = s1 * c2 * c3 - c1 * s2 * s3;
				this._y = c1 * s2 * c3 + s1 * c2 * s3;
				this._z = c1 * c2 * s3 - s1 * s2 * c3;
				this._w = c1 * c2 * c3 + s1 * s2 * s3;

			} else if ( order === 'YZX' ) {

				this._x = s1 * c2 * c3 + c1 * s2 * s3;
				this._y = c1 * s2 * c3 + s1 * c2 * s3;
				this._z = c1 * c2 * s3 - s1 * s2 * c3;
				this._w = c1 * c2 * c3 - s1 * s2 * s3;

			} else if ( order === 'XZY' ) {

				this._x = s1 * c2 * c3 - c1 * s2 * s3;
				this._y = c1 * s2 * c3 - s1 * c2 * s3;
				this._z = c1 * c2 * s3 + s1 * s2 * c3;
				this._w = c1 * c2 * c3 + s1 * s2 * s3;

			}

			if ( update !== false ) this.onChangeCallback();

			return this;

		},

		setFromAxisAngle: function ( axis, angle ) {

			// http://www.euclideanspace.com/maths/geometry/rotations/conversions/angleToQuaternion/index.htm

			// assumes axis is normalized

			var halfAngle = angle / 2, s = Math.sin( halfAngle );

			this._x = axis.x * s;
			this._y = axis.y * s;
			this._z = axis.z * s;
			this._w = Math.cos( halfAngle );

			this.onChangeCallback();

			return this;

		},

		setFromRotationMatrix: function ( m ) {

			// http://www.euclideanspace.com/maths/geometry/rotations/conversions/matrixToQuaternion/index.htm

			// assumes the upper 3x3 of m is a pure rotation matrix (i.e, unscaled)

			var te = m.elements,

				m11 = te[ 0 ], m12 = te[ 4 ], m13 = te[ 8 ],
				m21 = te[ 1 ], m22 = te[ 5 ], m23 = te[ 9 ],
				m31 = te[ 2 ], m32 = te[ 6 ], m33 = te[ 10 ],

				trace = m11 + m22 + m33,
				s;

			if ( trace > 0 ) {

				s = 0.5 / Math.sqrt( trace + 1.0 );

				this._w = 0.25 / s;
				this._x = ( m32 - m23 ) * s;
				this._y = ( m13 - m31 ) * s;
				this._z = ( m21 - m12 ) * s;

			} else if ( m11 > m22 && m11 > m33 ) {

				s = 2.0 * Math.sqrt( 1.0 + m11 - m22 - m33 );

				this._w = ( m32 - m23 ) / s;
				this._x = 0.25 * s;
				this._y = ( m12 + m21 ) / s;
				this._z = ( m13 + m31 ) / s;

			} else if ( m22 > m33 ) {

				s = 2.0 * Math.sqrt( 1.0 + m22 - m11 - m33 );

				this._w = ( m13 - m31 ) / s;
				this._x = ( m12 + m21 ) / s;
				this._y = 0.25 * s;
				this._z = ( m23 + m32 ) / s;

			} else {

				s = 2.0 * Math.sqrt( 1.0 + m33 - m11 - m22 );

				this._w = ( m21 - m12 ) / s;
				this._x = ( m13 + m31 ) / s;
				this._y = ( m23 + m32 ) / s;
				this._z = 0.25 * s;

			}

			this.onChangeCallback();

			return this;

		},

		setFromUnitVectors: function () {

			// assumes direction vectors vFrom and vTo are normalized

			var v1 = new Vector3();
			var r;

			var EPS = 0.000001;

			return function setFromUnitVectors( vFrom, vTo ) {

				if ( v1 === undefined ) v1 = new Vector3();

				r = vFrom.dot( vTo ) + 1;

				if ( r < EPS ) {

					r = 0;

					if ( Math.abs( vFrom.x ) > Math.abs( vFrom.z ) ) {

						v1.set( - vFrom.y, vFrom.x, 0 );

					} else {

						v1.set( 0, - vFrom.z, vFrom.y );

					}

				} else {

					v1.crossVectors( vFrom, vTo );

				}

				this._x = v1.x;
				this._y = v1.y;
				this._z = v1.z;
				this._w = r;

				return this.normalize();

			};

		}(),

		inverse: function () {

			return this.conjugate().normalize();

		},

		conjugate: function () {

			this._x *= - 1;
			this._y *= - 1;
			this._z *= - 1;

			this.onChangeCallback();

			return this;

		},

		dot: function ( v ) {

			return this._x * v._x + this._y * v._y + this._z * v._z + this._w * v._w;

		},

		lengthSq: function () {

			return this._x * this._x + this._y * this._y + this._z * this._z + this._w * this._w;

		},

		length: function () {

			return Math.sqrt( this._x * this._x + this._y * this._y + this._z * this._z + this._w * this._w );

		},

		normalize: function () {

			var l = this.length();

			if ( l === 0 ) {

				this._x = 0;
				this._y = 0;
				this._z = 0;
				this._w = 1;

			} else {

				l = 1 / l;

				this._x = this._x * l;
				this._y = this._y * l;
				this._z = this._z * l;
				this._w = this._w * l;

			}

			this.onChangeCallback();

			return this;

		},

		multiply: function ( q, p ) {

			if ( p !== undefined ) {

				console.warn( 'THREE.Quaternion: .multiply() now only accepts one argument. Use .multiplyQuaternions( a, b ) instead.' );
				return this.multiplyQuaternions( q, p );

			}

			return this.multiplyQuaternions( this, q );

		},

		premultiply: function ( q ) {

			return this.multiplyQuaternions( q, this );

		},

		multiplyQuaternions: function ( a, b ) {

			// from http://www.euclideanspace.com/maths/algebra/realNormedAlgebra/quaternions/code/index.htm

			var qax = a._x, qay = a._y, qaz = a._z, qaw = a._w;
			var qbx = b._x, qby = b._y, qbz = b._z, qbw = b._w;

			this._x = qax * qbw + qaw * qbx + qay * qbz - qaz * qby;
			this._y = qay * qbw + qaw * qby + qaz * qbx - qax * qbz;
			this._z = qaz * qbw + qaw * qbz + qax * qby - qay * qbx;
			this._w = qaw * qbw - qax * qbx - qay * qby - qaz * qbz;

			this.onChangeCallback();

			return this;

		},

		slerp: function ( qb, t ) {

			if ( t === 0 ) return this;
			if ( t === 1 ) return this.copy( qb );

			var x = this._x, y = this._y, z = this._z, w = this._w;

			// http://www.euclideanspace.com/maths/algebra/realNormedAlgebra/quaternions/slerp/

			var cosHalfTheta = w * qb._w + x * qb._x + y * qb._y + z * qb._z;

			if ( cosHalfTheta < 0 ) {

				this._w = - qb._w;
				this._x = - qb._x;
				this._y = - qb._y;
				this._z = - qb._z;

				cosHalfTheta = - cosHalfTheta;

			} else {

				this.copy( qb );

			}

			if ( cosHalfTheta >= 1.0 ) {

				this._w = w;
				this._x = x;
				this._y = y;
				this._z = z;

				return this;

			}

			var sinHalfTheta = Math.sqrt( 1.0 - cosHalfTheta * cosHalfTheta );

			if ( Math.abs( sinHalfTheta ) < 0.001 ) {

				this._w = 0.5 * ( w + this._w );
				this._x = 0.5 * ( x + this._x );
				this._y = 0.5 * ( y + this._y );
				this._z = 0.5 * ( z + this._z );

				return this;

			}

			var halfTheta = Math.atan2( sinHalfTheta, cosHalfTheta );
			var ratioA = Math.sin( ( 1 - t ) * halfTheta ) / sinHalfTheta,
				ratioB = Math.sin( t * halfTheta ) / sinHalfTheta;

			this._w = ( w * ratioA + this._w * ratioB );
			this._x = ( x * ratioA + this._x * ratioB );
			this._y = ( y * ratioA + this._y * ratioB );
			this._z = ( z * ratioA + this._z * ratioB );

			this.onChangeCallback();

			return this;

		},

		equals: function ( quaternion ) {

			return ( quaternion._x === this._x ) && ( quaternion._y === this._y ) && ( quaternion._z === this._z ) && ( quaternion._w === this._w );

		},

		fromArray: function ( array, offset ) {

			if ( offset === undefined ) offset = 0;

			this._x = array[ offset ];
			this._y = array[ offset + 1 ];
			this._z = array[ offset + 2 ];
			this._w = array[ offset + 3 ];

			this.onChangeCallback();

			return this;

		},

		toArray: function ( array, offset ) {

			if ( array === undefined ) array = [];
			if ( offset === undefined ) offset = 0;

			array[ offset ] = this._x;
			array[ offset + 1 ] = this._y;
			array[ offset + 2 ] = this._z;
			array[ offset + 3 ] = this._w;

			return array;

		},

		onChange: function ( callback ) {

			this.onChangeCallback = callback;

			return this;

		},

		onChangeCallback: function () {}

	} );

	/**
	 * @author mrdoob / http://mrdoob.com/
	 * @author kile / http://kile.stravaganza.org/
	 * @author philogb / http://blog.thejit.org/
	 * @author mikael emtinger / http://gomo.se/
	 * @author egraether / http://egraether.com/
	 * @author WestLangley / http://github.com/WestLangley
	 */

	function Vector3( x, y, z ) {

		this.x = x || 0;
		this.y = y || 0;
		this.z = z || 0;

	}

	Object.assign( Vector3.prototype, {

		isVector3: true,

		set: function ( x, y, z ) {

			this.x = x;
			this.y = y;
			this.z = z;

			return this;

		},

		setScalar: function ( scalar ) {

			this.x = scalar;
			this.y = scalar;
			this.z = scalar;

			return this;

		},

		setX: function ( x ) {

			this.x = x;

			return this;

		},

		setY: function ( y ) {

			this.y = y;

			return this;

		},

		setZ: function ( z ) {

			this.z = z;

			return this;

		},

		setComponent: function ( index, value ) {

			switch ( index ) {

				case 0: this.x = value; break;
				case 1: this.y = value; break;
				case 2: this.z = value; break;
				default: throw new Error( 'index is out of range: ' + index );

			}

			return this;

		},

		getComponent: function ( index ) {

			switch ( index ) {

				case 0: return this.x;
				case 1: return this.y;
				case 2: return this.z;
				default: throw new Error( 'index is out of range: ' + index );

			}

		},

		clone: function () {

			return new this.constructor( this.x, this.y, this.z );

		},

		copy: function ( v ) {

			this.x = v.x;
			this.y = v.y;
			this.z = v.z;

			return this;

		},

		add: function ( v, w ) {

			if ( w !== undefined ) {

				console.warn( 'THREE.Vector3: .add() now only accepts one argument. Use .addVectors( a, b ) instead.' );
				return this.addVectors( v, w );

			}

			this.x += v.x;
			this.y += v.y;
			this.z += v.z;

			return this;

		},

		addScalar: function ( s ) {

			this.x += s;
			this.y += s;
			this.z += s;

			return this;

		},

		addVectors: function ( a, b ) {

			this.x = a.x + b.x;
			this.y = a.y + b.y;
			this.z = a.z + b.z;

			return this;

		},

		addScaledVector: function ( v, s ) {

			this.x += v.x * s;
			this.y += v.y * s;
			this.z += v.z * s;

			return this;

		},

		sub: function ( v, w ) {

			if ( w !== undefined ) {

				console.warn( 'THREE.Vector3: .sub() now only accepts one argument. Use .subVectors( a, b ) instead.' );
				return this.subVectors( v, w );

			}

			this.x -= v.x;
			this.y -= v.y;
			this.z -= v.z;

			return this;

		},

		subScalar: function ( s ) {

			this.x -= s;
			this.y -= s;
			this.z -= s;

			return this;

		},

		subVectors: function ( a, b ) {

			this.x = a.x - b.x;
			this.y = a.y - b.y;
			this.z = a.z - b.z;

			return this;

		},

		multiply: function ( v, w ) {

			if ( w !== undefined ) {

				console.warn( 'THREE.Vector3: .multiply() now only accepts one argument. Use .multiplyVectors( a, b ) instead.' );
				return this.multiplyVectors( v, w );

			}

			this.x *= v.x;
			this.y *= v.y;
			this.z *= v.z;

			return this;

		},

		multiplyScalar: function ( scalar ) {

			this.x *= scalar;
			this.y *= scalar;
			this.z *= scalar;

			return this;

		},

		multiplyVectors: function ( a, b ) {

			this.x = a.x * b.x;
			this.y = a.y * b.y;
			this.z = a.z * b.z;

			return this;

		},

		applyEuler: function () {

			var quaternion = new Quaternion();

			return function applyEuler( euler ) {

				if ( ! ( euler && euler.isEuler ) ) {

					console.error( 'THREE.Vector3: .applyEuler() now expects an Euler rotation rather than a Vector3 and order.' );

				}

				return this.applyQuaternion( quaternion.setFromEuler( euler ) );

			};

		}(),

		applyAxisAngle: function () {

			var quaternion = new Quaternion();

			return function applyAxisAngle( axis, angle ) {

				return this.applyQuaternion( quaternion.setFromAxisAngle( axis, angle ) );

			};

		}(),

		applyMatrix3: function ( m ) {

			var x = this.x, y = this.y, z = this.z;
			var e = m.elements;

			this.x = e[ 0 ] * x + e[ 3 ] * y + e[ 6 ] * z;
			this.y = e[ 1 ] * x + e[ 4 ] * y + e[ 7 ] * z;
			this.z = e[ 2 ] * x + e[ 5 ] * y + e[ 8 ] * z;

			return this;

		},

		applyMatrix4: function ( m ) {

			var x = this.x, y = this.y, z = this.z;
			var e = m.elements;

			var w = 1 / ( e[ 3 ] * x + e[ 7 ] * y + e[ 11 ] * z + e[ 15 ] );

			this.x = ( e[ 0 ] * x + e[ 4 ] * y + e[ 8 ] * z + e[ 12 ] ) * w;
			this.y = ( e[ 1 ] * x + e[ 5 ] * y + e[ 9 ] * z + e[ 13 ] ) * w;
			this.z = ( e[ 2 ] * x + e[ 6 ] * y + e[ 10 ] * z + e[ 14 ] ) * w;

			return this;

		},

		applyQuaternion: function ( q ) {

			var x = this.x, y = this.y, z = this.z;
			var qx = q.x, qy = q.y, qz = q.z, qw = q.w;

			// calculate quat * vector

			var ix = qw * x + qy * z - qz * y;
			var iy = qw * y + qz * x - qx * z;
			var iz = qw * z + qx * y - qy * x;
			var iw = - qx * x - qy * y - qz * z;

			// calculate result * inverse quat

			this.x = ix * qw + iw * - qx + iy * - qz - iz * - qy;
			this.y = iy * qw + iw * - qy + iz * - qx - ix * - qz;
			this.z = iz * qw + iw * - qz + ix * - qy - iy * - qx;

			return this;

		},

		project: function () {

			var matrix = new Matrix4();

			return function project( camera ) {

				matrix.multiplyMatrices( camera.projectionMatrix, matrix.getInverse( camera.matrixWorld ) );
				return this.applyMatrix4( matrix );

			};

		}(),

		unproject: function () {

			var matrix = new Matrix4();

			return function unproject( camera ) {

				matrix.multiplyMatrices( camera.matrixWorld, matrix.getInverse( camera.projectionMatrix ) );
				return this.applyMatrix4( matrix );

			};

		}(),

		transformDirection: function ( m ) {

			// input: THREE.Matrix4 affine matrix
			// vector interpreted as a direction

			var x = this.x, y = this.y, z = this.z;
			var e = m.elements;

			this.x = e[ 0 ] * x + e[ 4 ] * y + e[ 8 ] * z;
			this.y = e[ 1 ] * x + e[ 5 ] * y + e[ 9 ] * z;
			this.z = e[ 2 ] * x + e[ 6 ] * y + e[ 10 ] * z;

			return this.normalize();

		},

		divide: function ( v ) {

			this.x /= v.x;
			this.y /= v.y;
			this.z /= v.z;

			return this;

		},

		divideScalar: function ( scalar ) {

			return this.multiplyScalar( 1 / scalar );

		},

		min: function ( v ) {

			this.x = Math.min( this.x, v.x );
			this.y = Math.min( this.y, v.y );
			this.z = Math.min( this.z, v.z );

			return this;

		},

		max: function ( v ) {

			this.x = Math.max( this.x, v.x );
			this.y = Math.max( this.y, v.y );
			this.z = Math.max( this.z, v.z );

			return this;

		},

		clamp: function ( min, max ) {

			// assumes min < max, componentwise

			this.x = Math.max( min.x, Math.min( max.x, this.x ) );
			this.y = Math.max( min.y, Math.min( max.y, this.y ) );
			this.z = Math.max( min.z, Math.min( max.z, this.z ) );

			return this;

		},

		clampScalar: function () {

			var min = new Vector3();
			var max = new Vector3();

			return function clampScalar( minVal, maxVal ) {

				min.set( minVal, minVal, minVal );
				max.set( maxVal, maxVal, maxVal );

				return this.clamp( min, max );

			};

		}(),

		clampLength: function ( min, max ) {

			var length = this.length();

			return this.divideScalar( length || 1 ).multiplyScalar( Math.max( min, Math.min( max, length ) ) );

		},

		floor: function () {

			this.x = Math.floor( this.x );
			this.y = Math.floor( this.y );
			this.z = Math.floor( this.z );

			return this;

		},

		ceil: function () {

			this.x = Math.ceil( this.x );
			this.y = Math.ceil( this.y );
			this.z = Math.ceil( this.z );

			return this;

		},

		round: function () {

			this.x = Math.round( this.x );
			this.y = Math.round( this.y );
			this.z = Math.round( this.z );

			return this;

		},

		roundToZero: function () {

			this.x = ( this.x < 0 ) ? Math.ceil( this.x ) : Math.floor( this.x );
			this.y = ( this.y < 0 ) ? Math.ceil( this.y ) : Math.floor( this.y );
			this.z = ( this.z < 0 ) ? Math.ceil( this.z ) : Math.floor( this.z );

			return this;

		},

		negate: function () {

			this.x = - this.x;
			this.y = - this.y;
			this.z = - this.z;

			return this;

		},

		dot: function ( v ) {

			return this.x * v.x + this.y * v.y + this.z * v.z;

		},

		// TODO lengthSquared?

		lengthSq: function () {

			return this.x * this.x + this.y * this.y + this.z * this.z;

		},

		length: function () {

			return Math.sqrt( this.x * this.x + this.y * this.y + this.z * this.z );

		},

		manhattanLength: function () {

			return Math.abs( this.x ) + Math.abs( this.y ) + Math.abs( this.z );

		},

		normalize: function () {

			return this.divideScalar( this.length() || 1 );

		},

		setLength: function ( length ) {

			return this.normalize().multiplyScalar( length );

		},

		lerp: function ( v, alpha ) {

			this.x += ( v.x - this.x ) * alpha;
			this.y += ( v.y - this.y ) * alpha;
			this.z += ( v.z - this.z ) * alpha;

			return this;

		},

		lerpVectors: function ( v1, v2, alpha ) {

			return this.subVectors( v2, v1 ).multiplyScalar( alpha ).add( v1 );

		},

		cross: function ( v, w ) {

			if ( w !== undefined ) {

				console.warn( 'THREE.Vector3: .cross() now only accepts one argument. Use .crossVectors( a, b ) instead.' );
				return this.crossVectors( v, w );

			}

			return this.crossVectors( this, v );

		},

		crossVectors: function ( a, b ) {

			var ax = a.x, ay = a.y, az = a.z;
			var bx = b.x, by = b.y, bz = b.z;

			this.x = ay * bz - az * by;
			this.y = az * bx - ax * bz;
			this.z = ax * by - ay * bx;

			return this;

		},

		projectOnVector: function ( vector ) {

			var scalar = vector.dot( this ) / vector.lengthSq();

			return this.copy( vector ).multiplyScalar( scalar );

		},

		projectOnPlane: function () {

			var v1 = new Vector3();

			return function projectOnPlane( planeNormal ) {

				v1.copy( this ).projectOnVector( planeNormal );

				return this.sub( v1 );

			};

		}(),

		reflect: function () {

			// reflect incident vector off plane orthogonal to normal
			// normal is assumed to have unit length

			var v1 = new Vector3();

			return function reflect( normal ) {

				return this.sub( v1.copy( normal ).multiplyScalar( 2 * this.dot( normal ) ) );

			};

		}(),

		angleTo: function ( v ) {

			var theta = this.dot( v ) / ( Math.sqrt( this.lengthSq() * v.lengthSq() ) );

			// clamp, to handle numerical problems

			return Math.acos( _Math.clamp( theta, - 1, 1 ) );

		},

		distanceTo: function ( v ) {

			return Math.sqrt( this.distanceToSquared( v ) );

		},

		distanceToSquared: function ( v ) {

			var dx = this.x - v.x, dy = this.y - v.y, dz = this.z - v.z;

			return dx * dx + dy * dy + dz * dz;

		},

		manhattanDistanceTo: function ( v ) {

			return Math.abs( this.x - v.x ) + Math.abs( this.y - v.y ) + Math.abs( this.z - v.z );

		},

		setFromSpherical: function ( s ) {

			var sinPhiRadius = Math.sin( s.phi ) * s.radius;

			this.x = sinPhiRadius * Math.sin( s.theta );
			this.y = Math.cos( s.phi ) * s.radius;
			this.z = sinPhiRadius * Math.cos( s.theta );

			return this;

		},

		setFromCylindrical: function ( c ) {

			this.x = c.radius * Math.sin( c.theta );
			this.y = c.y;
			this.z = c.radius * Math.cos( c.theta );

			return this;

		},

		setFromMatrixPosition: function ( m ) {

			var e = m.elements;

			this.x = e[ 12 ];
			this.y = e[ 13 ];
			this.z = e[ 14 ];

			return this;

		},

		setFromMatrixScale: function ( m ) {

			var sx = this.setFromMatrixColumn( m, 0 ).length();
			var sy = this.setFromMatrixColumn( m, 1 ).length();
			var sz = this.setFromMatrixColumn( m, 2 ).length();

			this.x = sx;
			this.y = sy;
			this.z = sz;

			return this;

		},

		setFromMatrixColumn: function ( m, index ) {

			return this.fromArray( m.elements, index * 4 );

		},

		equals: function ( v ) {

			return ( ( v.x === this.x ) && ( v.y === this.y ) && ( v.z === this.z ) );

		},

		fromArray: function ( array, offset ) {

			if ( offset === undefined ) offset = 0;

			this.x = array[ offset ];
			this.y = array[ offset + 1 ];
			this.z = array[ offset + 2 ];

			return this;

		},

		toArray: function ( array, offset ) {

			if ( array === undefined ) array = [];
			if ( offset === undefined ) offset = 0;

			array[ offset ] = this.x;
			array[ offset + 1 ] = this.y;
			array[ offset + 2 ] = this.z;

			return array;

		},

		fromBufferAttribute: function ( attribute, index, offset ) {

			if ( offset !== undefined ) {

				console.warn( 'THREE.Vector3: offset has been removed from .fromBufferAttribute().' );

			}

			this.x = attribute.getX( index );
			this.y = attribute.getY( index );
			this.z = attribute.getZ( index );

			return this;

		}

	} );

	/**
	 * @author mrdoob / http://mrdoob.com/
	 * @author alteredq / http://alteredqualia.com/
	 */

	function Face3( a, b, c, normal, color, materialIndex ) {

		this.a = a;
		this.b = b;
		this.c = c;

		this.normal = ( normal && normal.isVector3 ) ? normal : new Vector3();
		this.vertexNormals = Array.isArray( normal ) ? normal : [];

		this.color = ( color && color.isColor ) ? color : new Color();
		this.vertexColors = Array.isArray( color ) ? color : [];

		this.materialIndex = materialIndex !== undefined ? materialIndex : 0;

	}

	Object.assign( Face3.prototype, {

		clone: function () {

			return new this.constructor().copy( this );

		},

		copy: function ( source ) {

			this.a = source.a;
			this.b = source.b;
			this.c = source.c;

			this.normal.copy( source.normal );
			this.color.copy( source.color );

			this.materialIndex = source.materialIndex;

			for ( var i = 0, il = source.vertexNormals.length; i < il; i ++ ) {

				this.vertexNormals[ i ] = source.vertexNormals[ i ].clone();

			}

			for ( var i = 0, il = source.vertexColors.length; i < il; i ++ ) {

				this.vertexColors[ i ] = source.vertexColors[ i ].clone();

			}

			return this;

		}

	} );

	/**
	 * @author alteredq / http://alteredqualia.com/
	 * @author WestLangley / http://github.com/WestLangley
	 * @author bhouston / http://clara.io
	 * @author tschw
	 */

	function Matrix3() {

		this.elements = [

			1, 0, 0,
			0, 1, 0,
			0, 0, 1

		];

		if ( arguments.length > 0 ) {

			console.error( 'THREE.Matrix3: the constructor no longer reads arguments. use .set() instead.' );

		}

	}

	Object.assign( Matrix3.prototype, {

		isMatrix3: true,

		set: function ( n11, n12, n13, n21, n22, n23, n31, n32, n33 ) {

			var te = this.elements;

			te[ 0 ] = n11; te[ 1 ] = n21; te[ 2 ] = n31;
			te[ 3 ] = n12; te[ 4 ] = n22; te[ 5 ] = n32;
			te[ 6 ] = n13; te[ 7 ] = n23; te[ 8 ] = n33;

			return this;

		},

		identity: function () {

			this.set(

				1, 0, 0,
				0, 1, 0,
				0, 0, 1

			);

			return this;

		},

		clone: function () {

			return new this.constructor().fromArray( this.elements );

		},

		copy: function ( m ) {

			var te = this.elements;
			var me = m.elements;

			te[ 0 ] = me[ 0 ]; te[ 1 ] = me[ 1 ]; te[ 2 ] = me[ 2 ];
			te[ 3 ] = me[ 3 ]; te[ 4 ] = me[ 4 ]; te[ 5 ] = me[ 5 ];
			te[ 6 ] = me[ 6 ]; te[ 7 ] = me[ 7 ]; te[ 8 ] = me[ 8 ];

			return this;

		},

		setFromMatrix4: function ( m ) {

			var me = m.elements;

			this.set(

				me[ 0 ], me[ 4 ], me[ 8 ],
				me[ 1 ], me[ 5 ], me[ 9 ],
				me[ 2 ], me[ 6 ], me[ 10 ]

			);

			return this;

		},

		applyToBufferAttribute: function () {

			var v1 = new Vector3();

			return function applyToBufferAttribute( attribute ) {

				for ( var i = 0, l = attribute.count; i < l; i ++ ) {

					v1.x = attribute.getX( i );
					v1.y = attribute.getY( i );
					v1.z = attribute.getZ( i );

					v1.applyMatrix3( this );

					attribute.setXYZ( i, v1.x, v1.y, v1.z );

				}

				return attribute;

			};

		}(),

		multiply: function ( m ) {

			return this.multiplyMatrices( this, m );

		},

		premultiply: function ( m ) {

			return this.multiplyMatrices( m, this );

		},

		multiplyMatrices: function ( a, b ) {

			var ae = a.elements;
			var be = b.elements;
			var te = this.elements;

			var a11 = ae[ 0 ], a12 = ae[ 3 ], a13 = ae[ 6 ];
			var a21 = ae[ 1 ], a22 = ae[ 4 ], a23 = ae[ 7 ];
			var a31 = ae[ 2 ], a32 = ae[ 5 ], a33 = ae[ 8 ];

			var b11 = be[ 0 ], b12 = be[ 3 ], b13 = be[ 6 ];
			var b21 = be[ 1 ], b22 = be[ 4 ], b23 = be[ 7 ];
			var b31 = be[ 2 ], b32 = be[ 5 ], b33 = be[ 8 ];

			te[ 0 ] = a11 * b11 + a12 * b21 + a13 * b31;
			te[ 3 ] = a11 * b12 + a12 * b22 + a13 * b32;
			te[ 6 ] = a11 * b13 + a12 * b23 + a13 * b33;

			te[ 1 ] = a21 * b11 + a22 * b21 + a23 * b31;
			te[ 4 ] = a21 * b12 + a22 * b22 + a23 * b32;
			te[ 7 ] = a21 * b13 + a22 * b23 + a23 * b33;

			te[ 2 ] = a31 * b11 + a32 * b21 + a33 * b31;
			te[ 5 ] = a31 * b12 + a32 * b22 + a33 * b32;
			te[ 8 ] = a31 * b13 + a32 * b23 + a33 * b33;

			return this;

		},

		multiplyScalar: function ( s ) {

			var te = this.elements;

			te[ 0 ] *= s; te[ 3 ] *= s; te[ 6 ] *= s;
			te[ 1 ] *= s; te[ 4 ] *= s; te[ 7 ] *= s;
			te[ 2 ] *= s; te[ 5 ] *= s; te[ 8 ] *= s;

			return this;

		},

		determinant: function () {

			var te = this.elements;

			var a = te[ 0 ], b = te[ 1 ], c = te[ 2 ],
				d = te[ 3 ], e = te[ 4 ], f = te[ 5 ],
				g = te[ 6 ], h = te[ 7 ], i = te[ 8 ];

			return a * e * i - a * f * h - b * d * i + b * f * g + c * d * h - c * e * g;

		},

		getInverse: function ( matrix, throwOnDegenerate ) {

			if ( matrix && matrix.isMatrix4 ) {

				console.error( "THREE.Matrix3: .getInverse() no longer takes a Matrix4 argument." );

			}

			var me = matrix.elements,
				te = this.elements,

				n11 = me[ 0 ], n21 = me[ 1 ], n31 = me[ 2 ],
				n12 = me[ 3 ], n22 = me[ 4 ], n32 = me[ 5 ],
				n13 = me[ 6 ], n23 = me[ 7 ], n33 = me[ 8 ],

				t11 = n33 * n22 - n32 * n23,
				t12 = n32 * n13 - n33 * n12,
				t13 = n23 * n12 - n22 * n13,

				det = n11 * t11 + n21 * t12 + n31 * t13;

			if ( det === 0 ) {

				var msg = "THREE.Matrix3: .getInverse() can't invert matrix, determinant is 0";

				if ( throwOnDegenerate === true ) {

					throw new Error( msg );

				} else {

					console.warn( msg );

				}

				return this.identity();

			}

			var detInv = 1 / det;

			te[ 0 ] = t11 * detInv;
			te[ 1 ] = ( n31 * n23 - n33 * n21 ) * detInv;
			te[ 2 ] = ( n32 * n21 - n31 * n22 ) * detInv;

			te[ 3 ] = t12 * detInv;
			te[ 4 ] = ( n33 * n11 - n31 * n13 ) * detInv;
			te[ 5 ] = ( n31 * n12 - n32 * n11 ) * detInv;

			te[ 6 ] = t13 * detInv;
			te[ 7 ] = ( n21 * n13 - n23 * n11 ) * detInv;
			te[ 8 ] = ( n22 * n11 - n21 * n12 ) * detInv;

			return this;

		},

		transpose: function () {

			var tmp, m = this.elements;

			tmp = m[ 1 ]; m[ 1 ] = m[ 3 ]; m[ 3 ] = tmp;
			tmp = m[ 2 ]; m[ 2 ] = m[ 6 ]; m[ 6 ] = tmp;
			tmp = m[ 5 ]; m[ 5 ] = m[ 7 ]; m[ 7 ] = tmp;

			return this;

		},

		getNormalMatrix: function ( matrix4 ) {

			return this.setFromMatrix4( matrix4 ).getInverse( this ).transpose();

		},

		transposeIntoArray: function ( r ) {

			var m = this.elements;

			r[ 0 ] = m[ 0 ];
			r[ 1 ] = m[ 3 ];
			r[ 2 ] = m[ 6 ];
			r[ 3 ] = m[ 1 ];
			r[ 4 ] = m[ 4 ];
			r[ 5 ] = m[ 7 ];
			r[ 6 ] = m[ 2 ];
			r[ 7 ] = m[ 5 ];
			r[ 8 ] = m[ 8 ];

			return this;

		},

		setUvTransform: function ( tx, ty, sx, sy, rotation, cx, cy ) {

			var c = Math.cos( rotation );
			var s = Math.sin( rotation );

			this.set(
				sx * c, sx * s, - sx * ( c * cx + s * cy ) + cx + tx,
				- sy * s, sy * c, - sy * ( - s * cx + c * cy ) + cy + ty,
				0, 0, 1
			);

		},

		scale: function ( sx, sy ) {

			var te = this.elements;

			te[ 0 ] *= sx; te[ 3 ] *= sx; te[ 6 ] *= sx;
			te[ 1 ] *= sy; te[ 4 ] *= sy; te[ 7 ] *= sy;

			return this;

		},

		rotate: function ( theta ) {

			var c = Math.cos( theta );
			var s = Math.sin( theta );

			var te = this.elements;

			var a11 = te[ 0 ], a12 = te[ 3 ], a13 = te[ 6 ];
			var a21 = te[ 1 ], a22 = te[ 4 ], a23 = te[ 7 ];

			te[ 0 ] = c * a11 + s * a21;
			te[ 3 ] = c * a12 + s * a22;
			te[ 6 ] = c * a13 + s * a23;

			te[ 1 ] = - s * a11 + c * a21;
			te[ 4 ] = - s * a12 + c * a22;
			te[ 7 ] = - s * a13 + c * a23;

			return this;

		},

		translate: function ( tx, ty ) {

			var te = this.elements;

			te[ 0 ] += tx * te[ 2 ]; te[ 3 ] += tx * te[ 5 ]; te[ 6 ] += tx * te[ 8 ];
			te[ 1 ] += ty * te[ 2 ]; te[ 4 ] += ty * te[ 5 ]; te[ 7 ] += ty * te[ 8 ];

			return this;

		},

		equals: function ( matrix ) {

			var te = this.elements;
			var me = matrix.elements;

			for ( var i = 0; i < 9; i ++ ) {

				if ( te[ i ] !== me[ i ] ) return false;

			}

			return true;

		},

		fromArray: function ( array, offset ) {

			if ( offset === undefined ) offset = 0;

			for ( var i = 0; i < 9; i ++ ) {

				this.elements[ i ] = array[ i + offset ];

			}

			return this;

		},

		toArray: function ( array, offset ) {

			if ( array === undefined ) array = [];
			if ( offset === undefined ) offset = 0;

			var te = this.elements;

			array[ offset ] = te[ 0 ];
			array[ offset + 1 ] = te[ 1 ];
			array[ offset + 2 ] = te[ 2 ];

			array[ offset + 3 ] = te[ 3 ];
			array[ offset + 4 ] = te[ 4 ];
			array[ offset + 5 ] = te[ 5 ];

			array[ offset + 6 ] = te[ 6 ];
			array[ offset + 7 ] = te[ 7 ];
			array[ offset + 8 ] = te[ 8 ];

			return array;

		}

	} );

	/**
	 * @author bhouston / http://clara.io
	 * @author WestLangley / http://github.com/WestLangley
	 */

	function Box3( min, max ) {

		this.min = ( min !== undefined ) ? min : new Vector3( + Infinity, + Infinity, + Infinity );
		this.max = ( max !== undefined ) ? max : new Vector3( - Infinity, - Infinity, - Infinity );

	}

	Object.assign( Box3.prototype, {

		isBox3: true,

		set: function ( min, max ) {

			this.min.copy( min );
			this.max.copy( max );

			return this;

		},

		setFromArray: function ( array ) {

			var minX = + Infinity;
			var minY = + Infinity;
			var minZ = + Infinity;

			var maxX = - Infinity;
			var maxY = - Infinity;
			var maxZ = - Infinity;

			for ( var i = 0, l = array.length; i < l; i += 3 ) {

				var x = array[ i ];
				var y = array[ i + 1 ];
				var z = array[ i + 2 ];

				if ( x < minX ) minX = x;
				if ( y < minY ) minY = y;
				if ( z < minZ ) minZ = z;

				if ( x > maxX ) maxX = x;
				if ( y > maxY ) maxY = y;
				if ( z > maxZ ) maxZ = z;

			}

			this.min.set( minX, minY, minZ );
			this.max.set( maxX, maxY, maxZ );

			return this;

		},

		setFromBufferAttribute: function ( attribute ) {

			var minX = + Infinity;
			var minY = + Infinity;
			var minZ = + Infinity;

			var maxX = - Infinity;
			var maxY = - Infinity;
			var maxZ = - Infinity;

			for ( var i = 0, l = attribute.count; i < l; i ++ ) {

				var x = attribute.getX( i );
				var y = attribute.getY( i );
				var z = attribute.getZ( i );

				if ( x < minX ) minX = x;
				if ( y < minY ) minY = y;
				if ( z < minZ ) minZ = z;

				if ( x > maxX ) maxX = x;
				if ( y > maxY ) maxY = y;
				if ( z > maxZ ) maxZ = z;

			}

			this.min.set( minX, minY, minZ );
			this.max.set( maxX, maxY, maxZ );

			return this;

		},

		setFromPoints: function ( points ) {

			this.makeEmpty();

			for ( var i = 0, il = points.length; i < il; i ++ ) {

				this.expandByPoint( points[ i ] );

			}

			return this;

		},

		setFromCenterAndSize: function () {

			var v1 = new Vector3();

			return function setFromCenterAndSize( center, size ) {

				var halfSize = v1.copy( size ).multiplyScalar( 0.5 );

				this.min.copy( center ).sub( halfSize );
				this.max.copy( center ).add( halfSize );

				return this;

			};

		}(),

		setFromObject: function ( object ) {

			this.makeEmpty();

			return this.expandByObject( object );

		},

		clone: function () {

			return new this.constructor().copy( this );

		},

		copy: function ( box ) {

			this.min.copy( box.min );
			this.max.copy( box.max );

			return this;

		},

		makeEmpty: function () {

			this.min.x = this.min.y = this.min.z = + Infinity;
			this.max.x = this.max.y = this.max.z = - Infinity;

			return this;

		},

		isEmpty: function () {

			// this is a more robust check for empty than ( volume <= 0 ) because volume can get positive with two negative axes

			return ( this.max.x < this.min.x ) || ( this.max.y < this.min.y ) || ( this.max.z < this.min.z );

		},

		getCenter: function ( optionalTarget ) {

			var result = optionalTarget || new Vector3();
			return this.isEmpty() ? result.set( 0, 0, 0 ) : result.addVectors( this.min, this.max ).multiplyScalar( 0.5 );

		},

		getSize: function ( optionalTarget ) {

			var result = optionalTarget || new Vector3();
			return this.isEmpty() ? result.set( 0, 0, 0 ) : result.subVectors( this.max, this.min );

		},

		expandByPoint: function ( point ) {

			this.min.min( point );
			this.max.max( point );

			return this;

		},

		expandByVector: function ( vector ) {

			this.min.sub( vector );
			this.max.add( vector );

			return this;

		},

		expandByScalar: function ( scalar ) {

			this.min.addScalar( - scalar );
			this.max.addScalar( scalar );

			return this;

		},

		expandByObject: function () {

			// Computes the world-axis-aligned bounding box of an object (including its children),
			// accounting for both the object's, and children's, world transforms

			var scope, i, l;

			var v1 = new Vector3();

			function traverse( node ) {

				var geometry = node.geometry;

				if ( geometry !== undefined ) {

					if ( geometry.isGeometry ) {

						var vertices = geometry.vertices;

						for ( i = 0, l = vertices.length; i < l; i ++ ) {

							v1.copy( vertices[ i ] );
							v1.applyMatrix4( node.matrixWorld );

							scope.expandByPoint( v1 );

						}

					} else if ( geometry.isBufferGeometry ) {

						var attribute = geometry.attributes.position;

						if ( attribute !== undefined ) {

							for ( i = 0, l = attribute.count; i < l; i ++ ) {

								v1.fromBufferAttribute( attribute, i ).applyMatrix4( node.matrixWorld );

								scope.expandByPoint( v1 );

							}

						}

					}

				}

			}

			return function expandByObject( object ) {

				scope = this;

				object.updateMatrixWorld( true );

				object.traverse( traverse );

				return this;

			};

		}(),

		containsPoint: function ( point ) {

			return point.x < this.min.x || point.x > this.max.x ||
				point.y < this.min.y || point.y > this.max.y ||
				point.z < this.min.z || point.z > this.max.z ? false : true;

		},

		containsBox: function ( box ) {

			return this.min.x <= box.min.x && box.max.x <= this.max.x &&
				this.min.y <= box.min.y && box.max.y <= this.max.y &&
				this.min.z <= box.min.z && box.max.z <= this.max.z;

		},

		getParameter: function ( point, optionalTarget ) {

			// This can potentially have a divide by zero if the box
			// has a size dimension of 0.

			var result = optionalTarget || new Vector3();

			return result.set(
				( point.x - this.min.x ) / ( this.max.x - this.min.x ),
				( point.y - this.min.y ) / ( this.max.y - this.min.y ),
				( point.z - this.min.z ) / ( this.max.z - this.min.z )
			);

		},

		intersectsBox: function ( box ) {

			// using 6 splitting planes to rule out intersections.
			return box.max.x < this.min.x || box.min.x > this.max.x ||
				box.max.y < this.min.y || box.min.y > this.max.y ||
				box.max.z < this.min.z || box.min.z > this.max.z ? false : true;

		},

		intersectsSphere: ( function () {

			var closestPoint = new Vector3();

			return function intersectsSphere( sphere ) {

				// Find the point on the AABB closest to the sphere center.
				this.clampPoint( sphere.center, closestPoint );

				// If that point is inside the sphere, the AABB and sphere intersect.
				return closestPoint.distanceToSquared( sphere.center ) <= ( sphere.radius * sphere.radius );

			};

		} )(),

		intersectsPlane: function ( plane ) {

			// We compute the minimum and maximum dot product values. If those values
			// are on the same side (back or front) of the plane, then there is no intersection.

			var min, max;

			if ( plane.normal.x > 0 ) {

				min = plane.normal.x * this.min.x;
				max = plane.normal.x * this.max.x;

			} else {

				min = plane.normal.x * this.max.x;
				max = plane.normal.x * this.min.x;

			}

			if ( plane.normal.y > 0 ) {

				min += plane.normal.y * this.min.y;
				max += plane.normal.y * this.max.y;

			} else {

				min += plane.normal.y * this.max.y;
				max += plane.normal.y * this.min.y;

			}

			if ( plane.normal.z > 0 ) {

				min += plane.normal.z * this.min.z;
				max += plane.normal.z * this.max.z;

			} else {

				min += plane.normal.z * this.max.z;
				max += plane.normal.z * this.min.z;

			}

			return ( min <= plane.constant && max >= plane.constant );

		},

		clampPoint: function ( point, optionalTarget ) {

			var result = optionalTarget || new Vector3();
			return result.copy( point ).clamp( this.min, this.max );

		},

		distanceToPoint: function () {

			var v1 = new Vector3();

			return function distanceToPoint( point ) {

				var clampedPoint = v1.copy( point ).clamp( this.min, this.max );
				return clampedPoint.sub( point ).length();

			};

		}(),

		getBoundingSphere: function () {

			var v1 = new Vector3();

			return function getBoundingSphere( optionalTarget ) {

				var result = optionalTarget || new Sphere();

				this.getCenter( result.center );

				result.radius = this.getSize( v1 ).length() * 0.5;

				return result;

			};

		}(),

		intersect: function ( box ) {

			this.min.max( box.min );
			this.max.min( box.max );

			// ensure that if there is no overlap, the result is fully empty, not slightly empty with non-inf/+inf values that will cause subsequence intersects to erroneously return valid values.
			if ( this.isEmpty() ) this.makeEmpty();

			return this;

		},

		union: function ( box ) {

			this.min.min( box.min );
			this.max.max( box.max );

			return this;

		},

		applyMatrix4: function () {

			var points = [
				new Vector3(),
				new Vector3(),
				new Vector3(),
				new Vector3(),
				new Vector3(),
				new Vector3(),
				new Vector3(),
				new Vector3()
			];

			return function applyMatrix4( matrix ) {

				// transform of empty box is an empty box.
				if ( this.isEmpty() ) return this;

				// NOTE: I am using a binary pattern to specify all 2^3 combinations below
				points[ 0 ].set( this.min.x, this.min.y, this.min.z ).applyMatrix4( matrix ); // 000
				points[ 1 ].set( this.min.x, this.min.y, this.max.z ).applyMatrix4( matrix ); // 001
				points[ 2 ].set( this.min.x, this.max.y, this.min.z ).applyMatrix4( matrix ); // 010
				points[ 3 ].set( this.min.x, this.max.y, this.max.z ).applyMatrix4( matrix ); // 011
				points[ 4 ].set( this.max.x, this.min.y, this.min.z ).applyMatrix4( matrix ); // 100
				points[ 5 ].set( this.max.x, this.min.y, this.max.z ).applyMatrix4( matrix ); // 101
				points[ 6 ].set( this.max.x, this.max.y, this.min.z ).applyMatrix4( matrix ); // 110
				points[ 7 ].set( this.max.x, this.max.y, this.max.z ).applyMatrix4( matrix );	// 111

				this.setFromPoints( points );

				return this;

			};

		}(),

		translate: function ( offset ) {

			this.min.add( offset );
			this.max.add( offset );

			return this;

		},

		equals: function ( box ) {

			return box.min.equals( this.min ) && box.max.equals( this.max );

		}

	} );

	/**
	 * @author bhouston / http://clara.io
	 * @author mrdoob / http://mrdoob.com/
	 */

	function Sphere( center, radius ) {

		this.center = ( center !== undefined ) ? center : new Vector3();
		this.radius = ( radius !== undefined ) ? radius : 0;

	}

	Object.assign( Sphere.prototype, {

		set: function ( center, radius ) {

			this.center.copy( center );
			this.radius = radius;

			return this;

		},

		setFromPoints: function () {

			var box = new Box3();

			return function setFromPoints( points, optionalCenter ) {

				var center = this.center;

				if ( optionalCenter !== undefined ) {

					center.copy( optionalCenter );

				} else {

					box.setFromPoints( points ).getCenter( center );

				}

				var maxRadiusSq = 0;

				for ( var i = 0, il = points.length; i < il; i ++ ) {

					maxRadiusSq = Math.max( maxRadiusSq, center.distanceToSquared( points[ i ] ) );

				}

				this.radius = Math.sqrt( maxRadiusSq );

				return this;

			};

		}(),

		clone: function () {

			return new this.constructor().copy( this );

		},

		copy: function ( sphere ) {

			this.center.copy( sphere.center );
			this.radius = sphere.radius;

			return this;

		},

		empty: function () {

			return ( this.radius <= 0 );

		},

		containsPoint: function ( point ) {

			return ( point.distanceToSquared( this.center ) <= ( this.radius * this.radius ) );

		},

		distanceToPoint: function ( point ) {

			return ( point.distanceTo( this.center ) - this.radius );

		},

		intersectsSphere: function ( sphere ) {

			var radiusSum = this.radius + sphere.radius;

			return sphere.center.distanceToSquared( this.center ) <= ( radiusSum * radiusSum );

		},

		intersectsBox: function ( box ) {

			return box.intersectsSphere( this );

		},

		intersectsPlane: function ( plane ) {

			return Math.abs( plane.distanceToPoint( this.center ) ) <= this.radius;

		},

		clampPoint: function ( point, optionalTarget ) {

			var deltaLengthSq = this.center.distanceToSquared( point );

			var result = optionalTarget || new Vector3();

			result.copy( point );

			if ( deltaLengthSq > ( this.radius * this.radius ) ) {

				result.sub( this.center ).normalize();
				result.multiplyScalar( this.radius ).add( this.center );

			}

			return result;

		},

		getBoundingBox: function ( optionalTarget ) {

			var box = optionalTarget || new Box3();

			box.set( this.center, this.center );
			box.expandByScalar( this.radius );

			return box;

		},

		applyMatrix4: function ( matrix ) {

			this.center.applyMatrix4( matrix );
			this.radius = this.radius * matrix.getMaxScaleOnAxis();

			return this;

		},

		translate: function ( offset ) {

			this.center.add( offset );

			return this;

		},

		equals: function ( sphere ) {

			return sphere.center.equals( this.center ) && ( sphere.radius === this.radius );

		}

	} );

	/**
	 * @author mrdoob / http://mrdoob.com/
	 * @author philogb / http://blog.thejit.org/
	 * @author egraether / http://egraether.com/
	 * @author zz85 / http://www.lab4games.net/zz85/blog
	 */

	function Vector2( x, y ) {

		this.x = x || 0;
		this.y = y || 0;

	}

	Object.defineProperties( Vector2.prototype, {

		"width": {

			get: function () {

				return this.x;

			},

			set: function ( value ) {

				this.x = value;

			}

		},

		"height": {

			get: function () {

				return this.y;

			},

			set: function ( value ) {

				this.y = value;

			}

		}

	} );

	Object.assign( Vector2.prototype, {

		isVector2: true,

		set: function ( x, y ) {

			this.x = x;
			this.y = y;

			return this;

		},

		setScalar: function ( scalar ) {

			this.x = scalar;
			this.y = scalar;

			return this;

		},

		setX: function ( x ) {

			this.x = x;

			return this;

		},

		setY: function ( y ) {

			this.y = y;

			return this;

		},

		setComponent: function ( index, value ) {

			switch ( index ) {

				case 0: this.x = value; break;
				case 1: this.y = value; break;
				default: throw new Error( 'index is out of range: ' + index );

			}

			return this;

		},

		getComponent: function ( index ) {

			switch ( index ) {

				case 0: return this.x;
				case 1: return this.y;
				default: throw new Error( 'index is out of range: ' + index );

			}

		},

		clone: function () {

			return new this.constructor( this.x, this.y );

		},

		copy: function ( v ) {

			this.x = v.x;
			this.y = v.y;

			return this;

		},

		add: function ( v, w ) {

			if ( w !== undefined ) {

				console.warn( 'THREE.Vector2: .add() now only accepts one argument. Use .addVectors( a, b ) instead.' );
				return this.addVectors( v, w );

			}

			this.x += v.x;
			this.y += v.y;

			return this;

		},

		addScalar: function ( s ) {

			this.x += s;
			this.y += s;

			return this;

		},

		addVectors: function ( a, b ) {

			this.x = a.x + b.x;
			this.y = a.y + b.y;

			return this;

		},

		addScaledVector: function ( v, s ) {

			this.x += v.x * s;
			this.y += v.y * s;

			return this;

		},

		sub: function ( v, w ) {

			if ( w !== undefined ) {

				console.warn( 'THREE.Vector2: .sub() now only accepts one argument. Use .subVectors( a, b ) instead.' );
				return this.subVectors( v, w );

			}

			this.x -= v.x;
			this.y -= v.y;

			return this;

		},

		subScalar: function ( s ) {

			this.x -= s;
			this.y -= s;

			return this;

		},

		subVectors: function ( a, b ) {

			this.x = a.x - b.x;
			this.y = a.y - b.y;

			return this;

		},

		multiply: function ( v ) {

			this.x *= v.x;
			this.y *= v.y;

			return this;

		},

		multiplyScalar: function ( scalar ) {

			this.x *= scalar;
			this.y *= scalar;

			return this;

		},

		divide: function ( v ) {

			this.x /= v.x;
			this.y /= v.y;

			return this;

		},

		divideScalar: function ( scalar ) {

			return this.multiplyScalar( 1 / scalar );

		},

		applyMatrix3: function ( m ) {

			var x = this.x, y = this.y;
			var e = m.elements;

			this.x = e[ 0 ] * x + e[ 3 ] * y + e[ 6 ];
			this.y = e[ 1 ] * x + e[ 4 ] * y + e[ 7 ];

			return this;

		},

		min: function ( v ) {

			this.x = Math.min( this.x, v.x );
			this.y = Math.min( this.y, v.y );

			return this;

		},

		max: function ( v ) {

			this.x = Math.max( this.x, v.x );
			this.y = Math.max( this.y, v.y );

			return this;

		},

		clamp: function ( min, max ) {

			// assumes min < max, componentwise

			this.x = Math.max( min.x, Math.min( max.x, this.x ) );
			this.y = Math.max( min.y, Math.min( max.y, this.y ) );

			return this;

		},

		clampScalar: function () {

			var min = new Vector2();
			var max = new Vector2();

			return function clampScalar( minVal, maxVal ) {

				min.set( minVal, minVal );
				max.set( maxVal, maxVal );

				return this.clamp( min, max );

			};

		}(),

		clampLength: function ( min, max ) {

			var length = this.length();

			return this.divideScalar( length || 1 ).multiplyScalar( Math.max( min, Math.min( max, length ) ) );

		},

		floor: function () {

			this.x = Math.floor( this.x );
			this.y = Math.floor( this.y );

			return this;

		},

		ceil: function () {

			this.x = Math.ceil( this.x );
			this.y = Math.ceil( this.y );

			return this;

		},

		round: function () {

			this.x = Math.round( this.x );
			this.y = Math.round( this.y );

			return this;

		},

		roundToZero: function () {

			this.x = ( this.x < 0 ) ? Math.ceil( this.x ) : Math.floor( this.x );
			this.y = ( this.y < 0 ) ? Math.ceil( this.y ) : Math.floor( this.y );

			return this;

		},

		negate: function () {

			this.x = - this.x;
			this.y = - this.y;

			return this;

		},

		dot: function ( v ) {

			return this.x * v.x + this.y * v.y;

		},

		lengthSq: function () {

			return this.x * this.x + this.y * this.y;

		},

		length: function () {

			return Math.sqrt( this.x * this.x + this.y * this.y );

		},

		manhattanLength: function () {

			return Math.abs( this.x ) + Math.abs( this.y );

		},

		normalize: function () {

			return this.divideScalar( this.length() || 1 );

		},

		angle: function () {

			// computes the angle in radians with respect to the positive x-axis

			var angle = Math.atan2( this.y, this.x );

			if ( angle < 0 ) angle += 2 * Math.PI;

			return angle;

		},

		distanceTo: function ( v ) {

			return Math.sqrt( this.distanceToSquared( v ) );

		},

		distanceToSquared: function ( v ) {

			var dx = this.x - v.x, dy = this.y - v.y;
			return dx * dx + dy * dy;

		},

		manhattanDistanceTo: function ( v ) {

			return Math.abs( this.x - v.x ) + Math.abs( this.y - v.y );

		},

		setLength: function ( length ) {

			return this.normalize().multiplyScalar( length );

		},

		lerp: function ( v, alpha ) {

			this.x += ( v.x - this.x ) * alpha;
			this.y += ( v.y - this.y ) * alpha;

			return this;

		},

		lerpVectors: function ( v1, v2, alpha ) {

			return this.subVectors( v2, v1 ).multiplyScalar( alpha ).add( v1 );

		},

		equals: function ( v ) {

			return ( ( v.x === this.x ) && ( v.y === this.y ) );

		},

		fromArray: function ( array, offset ) {

			if ( offset === undefined ) offset = 0;

			this.x = array[ offset ];
			this.y = array[ offset + 1 ];

			return this;

		},

		toArray: function ( array, offset ) {

			if ( array === undefined ) array = [];
			if ( offset === undefined ) offset = 0;

			array[ offset ] = this.x;
			array[ offset + 1 ] = this.y;

			return array;

		},

		fromBufferAttribute: function ( attribute, index, offset ) {

			if ( offset !== undefined ) {

				console.warn( 'THREE.Vector2: offset has been removed from .fromBufferAttribute().' );

			}

			this.x = attribute.getX( index );
			this.y = attribute.getY( index );

			return this;

		},

		rotateAround: function ( center, angle ) {

			var c = Math.cos( angle ), s = Math.sin( angle );

			var x = this.x - center.x;
			var y = this.y - center.y;

			this.x = x * c - y * s + center.x;
			this.y = x * s + y * c + center.y;

			return this;

		}

	} );

	/**
	 * @author mrdoob / http://mrdoob.com/
	 * @author WestLangley / http://github.com/WestLangley
	 * @author bhouston / http://clara.io
	 */

	function Euler( x, y, z, order ) {

		this._x = x || 0;
		this._y = y || 0;
		this._z = z || 0;
		this._order = order || Euler.DefaultOrder;

	}

	Euler.RotationOrders = [ 'XYZ', 'YZX', 'ZXY', 'XZY', 'YXZ', 'ZYX' ];

	Euler.DefaultOrder = 'XYZ';

	Object.defineProperties( Euler.prototype, {

		x: {

			get: function () {

				return this._x;

			},

			set: function ( value ) {

				this._x = value;
				this.onChangeCallback();

			}

		},

		y: {

			get: function () {

				return this._y;

			},

			set: function ( value ) {

				this._y = value;
				this.onChangeCallback();

			}

		},

		z: {

			get: function () {

				return this._z;

			},

			set: function ( value ) {

				this._z = value;
				this.onChangeCallback();

			}

		},

		order: {

			get: function () {

				return this._order;

			},

			set: function ( value ) {

				this._order = value;
				this.onChangeCallback();

			}

		}

	} );

	Object.assign( Euler.prototype, {

		isEuler: true,

		set: function ( x, y, z, order ) {

			this._x = x;
			this._y = y;
			this._z = z;
			this._order = order || this._order;

			this.onChangeCallback();

			return this;

		},

		clone: function () {

			return new this.constructor( this._x, this._y, this._z, this._order );

		},

		copy: function ( euler ) {

			this._x = euler._x;
			this._y = euler._y;
			this._z = euler._z;
			this._order = euler._order;

			this.onChangeCallback();

			return this;

		},

		setFromRotationMatrix: function ( m, order, update ) {

			var clamp = _Math.clamp;

			// assumes the upper 3x3 of m is a pure rotation matrix (i.e, unscaled)

			var te = m.elements;
			var m11 = te[ 0 ], m12 = te[ 4 ], m13 = te[ 8 ];
			var m21 = te[ 1 ], m22 = te[ 5 ], m23 = te[ 9 ];
			var m31 = te[ 2 ], m32 = te[ 6 ], m33 = te[ 10 ];

			order = order || this._order;

			if ( order === 'XYZ' ) {

				this._y = Math.asin( clamp( m13, - 1, 1 ) );

				if ( Math.abs( m13 ) < 0.99999 ) {

					this._x = Math.atan2( - m23, m33 );
					this._z = Math.atan2( - m12, m11 );

				} else {

					this._x = Math.atan2( m32, m22 );
					this._z = 0;

				}

			} else if ( order === 'YXZ' ) {

				this._x = Math.asin( - clamp( m23, - 1, 1 ) );

				if ( Math.abs( m23 ) < 0.99999 ) {

					this._y = Math.atan2( m13, m33 );
					this._z = Math.atan2( m21, m22 );

				} else {

					this._y = Math.atan2( - m31, m11 );
					this._z = 0;

				}

			} else if ( order === 'ZXY' ) {

				this._x = Math.asin( clamp( m32, - 1, 1 ) );

				if ( Math.abs( m32 ) < 0.99999 ) {

					this._y = Math.atan2( - m31, m33 );
					this._z = Math.atan2( - m12, m22 );

				} else {

					this._y = 0;
					this._z = Math.atan2( m21, m11 );

				}

			} else if ( order === 'ZYX' ) {

				this._y = Math.asin( - clamp( m31, - 1, 1 ) );

				if ( Math.abs( m31 ) < 0.99999 ) {

					this._x = Math.atan2( m32, m33 );
					this._z = Math.atan2( m21, m11 );

				} else {

					this._x = 0;
					this._z = Math.atan2( - m12, m22 );

				}

			} else if ( order === 'YZX' ) {

				this._z = Math.asin( clamp( m21, - 1, 1 ) );

				if ( Math.abs( m21 ) < 0.99999 ) {

					this._x = Math.atan2( - m23, m22 );
					this._y = Math.atan2( - m31, m11 );

				} else {

					this._x = 0;
					this._y = Math.atan2( m13, m33 );

				}

			} else if ( order === 'XZY' ) {

				this._z = Math.asin( - clamp( m12, - 1, 1 ) );

				if ( Math.abs( m12 ) < 0.99999 ) {

					this._x = Math.atan2( m32, m22 );
					this._y = Math.atan2( m13, m11 );

				} else {

					this._x = Math.atan2( - m23, m33 );
					this._y = 0;

				}

			} else {

				console.warn( 'THREE.Euler: .setFromRotationMatrix() given unsupported order: ' + order );

			}

			this._order = order;

			if ( update !== false ) this.onChangeCallback();

			return this;

		},

		setFromQuaternion: function () {

			var matrix = new Matrix4();

			return function setFromQuaternion( q, order, update ) {

				matrix.makeRotationFromQuaternion( q );

				return this.setFromRotationMatrix( matrix, order, update );

			};

		}(),

		setFromVector3: function ( v, order ) {

			return this.set( v.x, v.y, v.z, order || this._order );

		},

		reorder: function () {

			// WARNING: this discards revolution information -bhouston

			var q = new Quaternion();

			return function reorder( newOrder ) {

				q.setFromEuler( this );

				return this.setFromQuaternion( q, newOrder );

			};

		}(),

		equals: function ( euler ) {

			return ( euler._x === this._x ) && ( euler._y === this._y ) && ( euler._z === this._z ) && ( euler._order === this._order );

		},

		fromArray: function ( array ) {

			this._x = array[ 0 ];
			this._y = array[ 1 ];
			this._z = array[ 2 ];
			if ( array[ 3 ] !== undefined ) this._order = array[ 3 ];

			this.onChangeCallback();

			return this;

		},

		toArray: function ( array, offset ) {

			if ( array === undefined ) array = [];
			if ( offset === undefined ) offset = 0;

			array[ offset ] = this._x;
			array[ offset + 1 ] = this._y;
			array[ offset + 2 ] = this._z;
			array[ offset + 3 ] = this._order;

			return array;

		},

		toVector3: function ( optionalResult ) {

			if ( optionalResult ) {

				return optionalResult.set( this._x, this._y, this._z );

			} else {

				return new Vector3( this._x, this._y, this._z );

			}

		},

		onChange: function ( callback ) {

			this.onChangeCallback = callback;

			return this;

		},

		onChangeCallback: function () {}

	} );

	/**
	 * @author mrdoob / http://mrdoob.com/
	 */

	function Layers() {

		this.mask = 1 | 0;

	}

	Object.assign( Layers.prototype, {

		set: function ( channel ) {

			this.mask = 1 << channel | 0;

		},

		enable: function ( channel ) {

			this.mask |= 1 << channel | 0;

		},

		toggle: function ( channel ) {

			this.mask ^= 1 << channel | 0;

		},

		disable: function ( channel ) {

			this.mask &= ~ ( 1 << channel | 0 );

		},

		test: function ( layers ) {

			return ( this.mask & layers.mask ) !== 0;

		}

	} );

	/**
	 * @author mrdoob / http://mrdoob.com/
	 * @author mikael emtinger / http://gomo.se/
	 * @author alteredq / http://alteredqualia.com/
	 * @author WestLangley / http://github.com/WestLangley
	 * @author elephantatwork / www.elephantatwork.ch
	 */

	var object3DId = 0;

	function Object3D() {

		Object.defineProperty( this, 'id', { value: object3DId ++ } );

		this.uuid = _Math.generateUUID();

		this.name = '';
		this.type = 'Object3D';

		this.parent = null;
		this.children = [];

		this.up = Object3D.DefaultUp.clone();

		var position = new Vector3();
		var rotation = new Euler();
		var quaternion = new Quaternion();
		var scale = new Vector3( 1, 1, 1 );

		function onRotationChange() {

			quaternion.setFromEuler( rotation, false );

		}

		function onQuaternionChange() {

			rotation.setFromQuaternion( quaternion, undefined, false );

		}

		rotation.onChange( onRotationChange );
		quaternion.onChange( onQuaternionChange );

		Object.defineProperties( this, {
			position: {
				enumerable: true,
				value: position
			},
			rotation: {
				enumerable: true,
				value: rotation
			},
			quaternion: {
				enumerable: true,
				value: quaternion
			},
			scale: {
				enumerable: true,
				value: scale
			},
			modelViewMatrix: {
				value: new Matrix4()
			},
			normalMatrix: {
				value: new Matrix3()
			}
		} );

		this.matrix = new Matrix4();
		this.matrixWorld = new Matrix4();

		this.matrixAutoUpdate = Object3D.DefaultMatrixAutoUpdate;
		this.matrixWorldNeedsUpdate = false;

		this.layers = new Layers();
		this.visible = true;

		this.castShadow = false;
		this.receiveShadow = false;

		this.frustumCulled = true;
		this.renderOrder = 0;

		this.userData = {};

	}

	Object3D.DefaultUp = new Vector3( 0, 1, 0 );
	Object3D.DefaultMatrixAutoUpdate = true;

	Object.assign( Object3D.prototype, EventDispatcher.prototype, {

		isObject3D: true,

		onBeforeRender: function () {},
		onAfterRender: function () {},

		applyMatrix: function ( matrix ) {

			this.matrix.multiplyMatrices( matrix, this.matrix );

			this.matrix.decompose( this.position, this.quaternion, this.scale );

		},

		applyQuaternion: function ( q ) {

			this.quaternion.premultiply( q );

			return this;

		},

		setRotationFromAxisAngle: function ( axis, angle ) {

			// assumes axis is normalized

			this.quaternion.setFromAxisAngle( axis, angle );

		},

		setRotationFromEuler: function ( euler ) {

			this.quaternion.setFromEuler( euler, true );

		},

		setRotationFromMatrix: function ( m ) {

			// assumes the upper 3x3 of m is a pure rotation matrix (i.e, unscaled)

			this.quaternion.setFromRotationMatrix( m );

		},

		setRotationFromQuaternion: function ( q ) {

			// assumes q is normalized

			this.quaternion.copy( q );

		},

		rotateOnAxis: function () {

			// rotate object on axis in object space
			// axis is assumed to be normalized

			var q1 = new Quaternion();

			return function rotateOnAxis( axis, angle ) {

				q1.setFromAxisAngle( axis, angle );

				this.quaternion.multiply( q1 );

				return this;

			};

		}(),

		rotateOnWorldAxis: function () {

			// rotate object on axis in world space
			// axis is assumed to be normalized
			// method assumes no rotated parent

			var q1 = new Quaternion();

			return function rotateOnWorldAxis( axis, angle ) {

				q1.setFromAxisAngle( axis, angle );

				this.quaternion.premultiply( q1 );

				return this;

			};

		}(),

		rotateX: function () {

			var v1 = new Vector3( 1, 0, 0 );

			return function rotateX( angle ) {

				return this.rotateOnAxis( v1, angle );

			};

		}(),

		rotateY: function () {

			var v1 = new Vector3( 0, 1, 0 );

			return function rotateY( angle ) {

				return this.rotateOnAxis( v1, angle );

			};

		}(),

		rotateZ: function () {

			var v1 = new Vector3( 0, 0, 1 );

			return function rotateZ( angle ) {

				return this.rotateOnAxis( v1, angle );

			};

		}(),

		translateOnAxis: function () {

			// translate object by distance along axis in object space
			// axis is assumed to be normalized

			var v1 = new Vector3();

			return function translateOnAxis( axis, distance ) {

				v1.copy( axis ).applyQuaternion( this.quaternion );

				this.position.add( v1.multiplyScalar( distance ) );

				return this;

			};

		}(),

		translateX: function () {

			var v1 = new Vector3( 1, 0, 0 );

			return function translateX( distance ) {

				return this.translateOnAxis( v1, distance );

			};

		}(),

		translateY: function () {

			var v1 = new Vector3( 0, 1, 0 );

			return function translateY( distance ) {

				return this.translateOnAxis( v1, distance );

			};

		}(),

		translateZ: function () {

			var v1 = new Vector3( 0, 0, 1 );

			return function translateZ( distance ) {

				return this.translateOnAxis( v1, distance );

			};

		}(),

		localToWorld: function ( vector ) {

			return vector.applyMatrix4( this.matrixWorld );

		},

		worldToLocal: function () {

			var m1 = new Matrix4();

			return function worldToLocal( vector ) {

				return vector.applyMatrix4( m1.getInverse( this.matrixWorld ) );

			};

		}(),

		lookAt: function () {

			// This method does not support objects with rotated and/or translated parent(s)

			var m1 = new Matrix4();
			var vector = new Vector3();

			return function lookAt( x, y, z ) {

				if ( x.isVector3 ) {

					vector.copy( x );

				} else {

					vector.set( x, y, z );

				}

				if ( this.isCamera ) {

					m1.lookAt( this.position, vector, this.up );

				} else {

					m1.lookAt( vector, this.position, this.up );

				}

				this.quaternion.setFromRotationMatrix( m1 );

			};

		}(),

		add: function ( object ) {

			if ( arguments.length > 1 ) {

				for ( var i = 0; i < arguments.length; i ++ ) {

					this.add( arguments[ i ] );

				}

				return this;

			}

			if ( object === this ) {

				console.error( "THREE.Object3D.add: object can't be added as a child of itself.", object );
				return this;

			}

			if ( ( object && object.isObject3D ) ) {

				if ( object.parent !== null ) {

					object.parent.remove( object );

				}

				object.parent = this;
				object.dispatchEvent( { type: 'added' } );

				this.children.push( object );

			} else {

				console.error( "THREE.Object3D.add: object not an instance of THREE.Object3D.", object );

			}

			return this;

		},

		remove: function ( object ) {

			if ( arguments.length > 1 ) {

				for ( var i = 0; i < arguments.length; i ++ ) {

					this.remove( arguments[ i ] );

				}

				return this;

			}

			var index = this.children.indexOf( object );

			if ( index !== - 1 ) {

				object.parent = null;

				object.dispatchEvent( { type: 'removed' } );

				this.children.splice( index, 1 );

			}

			return this;

		},

		getObjectById: function ( id ) {

			return this.getObjectByProperty( 'id', id );

		},

		getObjectByName: function ( name ) {

			return this.getObjectByProperty( 'name', name );

		},

		getObjectByProperty: function ( name, value ) {

			if ( this[ name ] === value ) return this;

			for ( var i = 0, l = this.children.length; i < l; i ++ ) {

				var child = this.children[ i ];
				var object = child.getObjectByProperty( name, value );

				if ( object !== undefined ) {

					return object;

				}

			}

			return undefined;

		},

		getWorldPosition: function ( optionalTarget ) {

			var result = optionalTarget || new Vector3();

			this.updateMatrixWorld( true );

			return result.setFromMatrixPosition( this.matrixWorld );

		},

		getWorldQuaternion: function () {

			var position = new Vector3();
			var scale = new Vector3();

			return function getWorldQuaternion( optionalTarget ) {

				var result = optionalTarget || new Quaternion();

				this.updateMatrixWorld( true );

				this.matrixWorld.decompose( position, result, scale );

				return result;

			};

		}(),

		getWorldRotation: function () {

			var quaternion = new Quaternion();

			return function getWorldRotation( optionalTarget ) {

				var result = optionalTarget || new Euler();

				this.getWorldQuaternion( quaternion );

				return result.setFromQuaternion( quaternion, this.rotation.order, false );

			};

		}(),

		getWorldScale: function () {

			var position = new Vector3();
			var quaternion = new Quaternion();

			return function getWorldScale( optionalTarget ) {

				var result = optionalTarget || new Vector3();

				this.updateMatrixWorld( true );

				this.matrixWorld.decompose( position, quaternion, result );

				return result;

			};

		}(),

		getWorldDirection: function () {

			var quaternion = new Quaternion();

			return function getWorldDirection( optionalTarget ) {

				var result = optionalTarget || new Vector3();

				this.getWorldQuaternion( quaternion );

				return result.set( 0, 0, 1 ).applyQuaternion( quaternion );

			};

		}(),

		raycast: function () {},

		traverse: function ( callback ) {

			callback( this );

			var children = this.children;

			for ( var i = 0, l = children.length; i < l; i ++ ) {

				children[ i ].traverse( callback );

			}

		},

		traverseVisible: function ( callback ) {

			if ( this.visible === false ) return;

			callback( this );

			var children = this.children;

			for ( var i = 0, l = children.length; i < l; i ++ ) {

				children[ i ].traverseVisible( callback );

			}

		},

		traverseAncestors: function ( callback ) {

			var parent = this.parent;

			if ( parent !== null ) {

				callback( parent );

				parent.traverseAncestors( callback );

			}

		},

		updateMatrix: function () {

			this.matrix.compose( this.position, this.quaternion, this.scale );

			this.matrixWorldNeedsUpdate = true;

		},

		updateMatrixWorld: function ( force ) {

			if ( this.matrixAutoUpdate ) this.updateMatrix();

			if ( this.matrixWorldNeedsUpdate || force ) {

				if ( this.parent === null ) {

					this.matrixWorld.copy( this.matrix );

				} else {

					this.matrixWorld.multiplyMatrices( this.parent.matrixWorld, this.matrix );

				}

				this.matrixWorldNeedsUpdate = false;

				force = true;

			}

			// update children

			var children = this.children;

			for ( var i = 0, l = children.length; i < l; i ++ ) {

				children[ i ].updateMatrixWorld( force );

			}

		},

		toJSON: function ( meta ) {

			// meta is a string when called from JSON.stringify
			var isRootObject = ( meta === undefined || typeof meta === 'string' );

			var output = {};

			// meta is a hash used to collect geometries, materials.
			// not providing it implies that this is the root object
			// being serialized.
			if ( isRootObject ) {

				// initialize meta obj
				meta = {
					geometries: {},
					materials: {},
					textures: {},
					images: {}
				};

				output.metadata = {
					version: 4.5,
					type: 'Object',
					generator: 'Object3D.toJSON'
				};

			}

			// standard Object3D serialization

			var object = {};

			object.uuid = this.uuid;
			object.type = this.type;

			if ( this.name !== '' ) object.name = this.name;
			if ( this.castShadow === true ) object.castShadow = true;
			if ( this.receiveShadow === true ) object.receiveShadow = true;
			if ( this.visible === false ) object.visible = false;
			if ( JSON.stringify( this.userData ) !== '{}' ) object.userData = this.userData;

			object.matrix = this.matrix.toArray();

			//

			function serialize( library, element ) {

				if ( library[ element.uuid ] === undefined ) {

					library[ element.uuid ] = element.toJSON( meta );

				}

				return element.uuid;

			}

			if ( this.geometry !== undefined ) {

				object.geometry = serialize( meta.geometries, this.geometry );

			}

			if ( this.material !== undefined ) {

				if ( Array.isArray( this.material ) ) {

					var uuids = [];

					for ( var i = 0, l = this.material.length; i < l; i ++ ) {

						uuids.push( serialize( meta.materials, this.material[ i ] ) );

					}

					object.material = uuids;

				} else {

					object.material = serialize( meta.materials, this.material );

				}

			}

			//

			if ( this.children.length > 0 ) {

				object.children = [];

				for ( var i = 0; i < this.children.length; i ++ ) {

					object.children.push( this.children[ i ].toJSON( meta ).object );

				}

			}

			if ( isRootObject ) {

				var geometries = extractFromCache( meta.geometries );
				var materials = extractFromCache( meta.materials );
				var textures = extractFromCache( meta.textures );
				var images = extractFromCache( meta.images );

				if ( geometries.length > 0 ) output.geometries = geometries;
				if ( materials.length > 0 ) output.materials = materials;
				if ( textures.length > 0 ) output.textures = textures;
				if ( images.length > 0 ) output.images = images;

			}

			output.object = object;

			return output;

			// extract data from the cache hash
			// remove metadata on each item
			// and return as array
			function extractFromCache( cache ) {

				var values = [];
				for ( var key in cache ) {

					var data = cache[ key ];
					delete data.metadata;
					values.push( data );

				}
				return values;

			}

		},

		clone: function ( recursive ) {

			return new this.constructor().copy( this, recursive );

		},

		copy: function ( source, recursive ) {

			if ( recursive === undefined ) recursive = true;

			this.name = source.name;

			this.up.copy( source.up );

			this.position.copy( source.position );
			this.quaternion.copy( source.quaternion );
			this.scale.copy( source.scale );

			this.matrix.copy( source.matrix );
			this.matrixWorld.copy( source.matrixWorld );

			this.matrixAutoUpdate = source.matrixAutoUpdate;
			this.matrixWorldNeedsUpdate = source.matrixWorldNeedsUpdate;

			this.layers.mask = source.layers.mask;
			this.visible = source.visible;

			this.castShadow = source.castShadow;
			this.receiveShadow = source.receiveShadow;

			this.frustumCulled = source.frustumCulled;
			this.renderOrder = source.renderOrder;

			this.userData = JSON.parse( JSON.stringify( source.userData ) );

			if ( recursive === true ) {

				for ( var i = 0; i < source.children.length; i ++ ) {

					var child = source.children[ i ];
					this.add( child.clone() );

				}

			}

			return this;

		}

	} );

	/**
	 * @author mrdoob / http://mrdoob.com/
	 * @author kile / http://kile.stravaganza.org/
	 * @author alteredq / http://alteredqualia.com/
	 * @author mikael emtinger / http://gomo.se/
	 * @author zz85 / http://www.lab4games.net/zz85/blog
	 * @author bhouston / http://clara.io
	 */

	var geometryId = 0; // Geometry uses even numbers as Id

	function Geometry() {

		Object.defineProperty( this, 'id', { value: geometryId += 2 } );

		this.uuid = _Math.generateUUID();

		this.name = '';
		this.type = 'Geometry';

		this.vertices = [];
		this.colors = [];
		this.faces = [];
		this.faceVertexUvs = [[]];

		this.morphTargets = [];
		this.morphNormals = [];

		this.skinWeights = [];
		this.skinIndices = [];

		this.lineDistances = [];

		this.boundingBox = null;
		this.boundingSphere = null;

		// update flags

		this.elementsNeedUpdate = false;
		this.verticesNeedUpdate = false;
		this.uvsNeedUpdate = false;
		this.normalsNeedUpdate = false;
		this.colorsNeedUpdate = false;
		this.lineDistancesNeedUpdate = false;
		this.groupsNeedUpdate = false;

	}

	Object.assign( Geometry.prototype, EventDispatcher.prototype, {

		isGeometry: true,

		applyMatrix: function ( matrix ) {

			var normalMatrix = new Matrix3().getNormalMatrix( matrix );

			for ( var i = 0, il = this.vertices.length; i < il; i ++ ) {

				var vertex = this.vertices[ i ];
				vertex.applyMatrix4( matrix );

			}

			for ( var i = 0, il = this.faces.length; i < il; i ++ ) {

				var face = this.faces[ i ];
				face.normal.applyMatrix3( normalMatrix ).normalize();

				for ( var j = 0, jl = face.vertexNormals.length; j < jl; j ++ ) {

					face.vertexNormals[ j ].applyMatrix3( normalMatrix ).normalize();

				}

			}

			if ( this.boundingBox !== null ) {

				this.computeBoundingBox();

			}

			if ( this.boundingSphere !== null ) {

				this.computeBoundingSphere();

			}

			this.verticesNeedUpdate = true;
			this.normalsNeedUpdate = true;

			return this;

		},

		rotateX: function () {

			// rotate geometry around world x-axis

			var m1 = new Matrix4();

			return function rotateX( angle ) {

				m1.makeRotationX( angle );

				this.applyMatrix( m1 );

				return this;

			};

		}(),

		rotateY: function () {

			// rotate geometry around world y-axis

			var m1 = new Matrix4();

			return function rotateY( angle ) {

				m1.makeRotationY( angle );

				this.applyMatrix( m1 );

				return this;

			};

		}(),

		rotateZ: function () {

			// rotate geometry around world z-axis

			var m1 = new Matrix4();

			return function rotateZ( angle ) {

				m1.makeRotationZ( angle );

				this.applyMatrix( m1 );

				return this;

			};

		}(),

		translate: function () {

			// translate geometry

			var m1 = new Matrix4();

			return function translate( x, y, z ) {

				m1.makeTranslation( x, y, z );

				this.applyMatrix( m1 );

				return this;

			};

		}(),

		scale: function () {

			// scale geometry

			var m1 = new Matrix4();

			return function scale( x, y, z ) {

				m1.makeScale( x, y, z );

				this.applyMatrix( m1 );

				return this;

			};

		}(),

		lookAt: function () {

			var obj = new Object3D();

			return function lookAt( vector ) {

				obj.lookAt( vector );

				obj.updateMatrix();

				this.applyMatrix( obj.matrix );

			};

		}(),

		fromBufferGeometry: function ( geometry ) {

			var scope = this;

			var indices = geometry.index !== null ? geometry.index.array : undefined;
			var attributes = geometry.attributes;

			var positions = attributes.position.array;
			var normals = attributes.normal !== undefined ? attributes.normal.array : undefined;
			var colors = attributes.color !== undefined ? attributes.color.array : undefined;
			var uvs = attributes.uv !== undefined ? attributes.uv.array : undefined;
			var uvs2 = attributes.uv2 !== undefined ? attributes.uv2.array : undefined;

			if ( uvs2 !== undefined ) this.faceVertexUvs[ 1 ] = [];

			var tempNormals = [];
			var tempUVs = [];
			var tempUVs2 = [];

			for ( var i = 0, j = 0; i < positions.length; i += 3, j += 2 ) {

				scope.vertices.push( new Vector3( positions[ i ], positions[ i + 1 ], positions[ i + 2 ] ) );

				if ( normals !== undefined ) {

					tempNormals.push( new Vector3( normals[ i ], normals[ i + 1 ], normals[ i + 2 ] ) );

				}

				if ( colors !== undefined ) {

					scope.colors.push( new Color( colors[ i ], colors[ i + 1 ], colors[ i + 2 ] ) );

				}

				if ( uvs !== undefined ) {

					tempUVs.push( new Vector2( uvs[ j ], uvs[ j + 1 ] ) );

				}

				if ( uvs2 !== undefined ) {

					tempUVs2.push( new Vector2( uvs2[ j ], uvs2[ j + 1 ] ) );

				}

			}

			function addFace( a, b, c, materialIndex ) {

				var vertexNormals = normals !== undefined ? [ tempNormals[ a ].clone(), tempNormals[ b ].clone(), tempNormals[ c ].clone() ] : [];
				var vertexColors = colors !== undefined ? [ scope.colors[ a ].clone(), scope.colors[ b ].clone(), scope.colors[ c ].clone() ] : [];

				var face = new Face3( a, b, c, vertexNormals, vertexColors, materialIndex );

				scope.faces.push( face );

				if ( uvs !== undefined ) {

					scope.faceVertexUvs[ 0 ].push( [ tempUVs[ a ].clone(), tempUVs[ b ].clone(), tempUVs[ c ].clone() ] );

				}

				if ( uvs2 !== undefined ) {

					scope.faceVertexUvs[ 1 ].push( [ tempUVs2[ a ].clone(), tempUVs2[ b ].clone(), tempUVs2[ c ].clone() ] );

				}

			}

			var groups = geometry.groups;

			if ( groups.length > 0 ) {

				for ( var i = 0; i < groups.length; i ++ ) {

					var group = groups[ i ];

					var start = group.start;
					var count = group.count;

					for ( var j = start, jl = start + count; j < jl; j += 3 ) {

						if ( indices !== undefined ) {

							addFace( indices[ j ], indices[ j + 1 ], indices[ j + 2 ], group.materialIndex );

						} else {

							addFace( j, j + 1, j + 2, group.materialIndex );

						}

					}

				}

			} else {

				if ( indices !== undefined ) {

					for ( var i = 0; i < indices.length; i += 3 ) {

						addFace( indices[ i ], indices[ i + 1 ], indices[ i + 2 ] );

					}

				} else {

					for ( var i = 0; i < positions.length / 3; i += 3 ) {

						addFace( i, i + 1, i + 2 );

					}

				}

			}

			this.computeFaceNormals();

			if ( geometry.boundingBox !== null ) {

				this.boundingBox = geometry.boundingBox.clone();

			}

			if ( geometry.boundingSphere !== null ) {

				this.boundingSphere = geometry.boundingSphere.clone();

			}

			return this;

		},

		center: function () {

			this.computeBoundingBox();

			var offset = this.boundingBox.getCenter().negate();

			this.translate( offset.x, offset.y, offset.z );

			return offset;

		},

		normalize: function () {

			this.computeBoundingSphere();

			var center = this.boundingSphere.center;
			var radius = this.boundingSphere.radius;

			var s = radius === 0 ? 1 : 1.0 / radius;

			var matrix = new Matrix4();
			matrix.set(
				s, 0, 0, - s * center.x,
				0, s, 0, - s * center.y,
				0, 0, s, - s * center.z,
				0, 0, 0, 1
			);

			this.applyMatrix( matrix );

			return this;

		},

		computeFaceNormals: function () {

			var cb = new Vector3(), ab = new Vector3();

			for ( var f = 0, fl = this.faces.length; f < fl; f ++ ) {

				var face = this.faces[ f ];

				var vA = this.vertices[ face.a ];
				var vB = this.vertices[ face.b ];
				var vC = this.vertices[ face.c ];

				cb.subVectors( vC, vB );
				ab.subVectors( vA, vB );
				cb.cross( ab );

				cb.normalize();

				face.normal.copy( cb );

			}

		},

		computeVertexNormals: function ( areaWeighted ) {

			if ( areaWeighted === undefined ) areaWeighted = true;

			var v, vl, f, fl, face, vertices;

			vertices = new Array( this.vertices.length );

			for ( v = 0, vl = this.vertices.length; v < vl; v ++ ) {

				vertices[ v ] = new Vector3();

			}

			if ( areaWeighted ) {

				// vertex normals weighted by triangle areas
				// http://www.iquilezles.org/www/articles/normals/normals.htm

				var vA, vB, vC;
				var cb = new Vector3(), ab = new Vector3();

				for ( f = 0, fl = this.faces.length; f < fl; f ++ ) {

					face = this.faces[ f ];

					vA = this.vertices[ face.a ];
					vB = this.vertices[ face.b ];
					vC = this.vertices[ face.c ];

					cb.subVectors( vC, vB );
					ab.subVectors( vA, vB );
					cb.cross( ab );

					vertices[ face.a ].add( cb );
					vertices[ face.b ].add( cb );
					vertices[ face.c ].add( cb );

				}

			} else {

				this.computeFaceNormals();

				for ( f = 0, fl = this.faces.length; f < fl; f ++ ) {

					face = this.faces[ f ];

					vertices[ face.a ].add( face.normal );
					vertices[ face.b ].add( face.normal );
					vertices[ face.c ].add( face.normal );

				}

			}

			for ( v = 0, vl = this.vertices.length; v < vl; v ++ ) {

				vertices[ v ].normalize();

			}

			for ( f = 0, fl = this.faces.length; f < fl; f ++ ) {

				face = this.faces[ f ];

				var vertexNormals = face.vertexNormals;

				if ( vertexNormals.length === 3 ) {

					vertexNormals[ 0 ].copy( vertices[ face.a ] );
					vertexNormals[ 1 ].copy( vertices[ face.b ] );
					vertexNormals[ 2 ].copy( vertices[ face.c ] );

				} else {

					vertexNormals[ 0 ] = vertices[ face.a ].clone();
					vertexNormals[ 1 ] = vertices[ face.b ].clone();
					vertexNormals[ 2 ] = vertices[ face.c ].clone();

				}

			}

			if ( this.faces.length > 0 ) {

				this.normalsNeedUpdate = true;

			}

		},

		computeFlatVertexNormals: function () {

			var f, fl, face;

			this.computeFaceNormals();

			for ( f = 0, fl = this.faces.length; f < fl; f ++ ) {

				face = this.faces[ f ];

				var vertexNormals = face.vertexNormals;

				if ( vertexNormals.length === 3 ) {

					vertexNormals[ 0 ].copy( face.normal );
					vertexNormals[ 1 ].copy( face.normal );
					vertexNormals[ 2 ].copy( face.normal );

				} else {

					vertexNormals[ 0 ] = face.normal.clone();
					vertexNormals[ 1 ] = face.normal.clone();
					vertexNormals[ 2 ] = face.normal.clone();

				}

			}

			if ( this.faces.length > 0 ) {

				this.normalsNeedUpdate = true;

			}

		},

		computeMorphNormals: function () {

			var i, il, f, fl, face;

			// save original normals
			// - create temp variables on first access
			//   otherwise just copy (for faster repeated calls)

			for ( f = 0, fl = this.faces.length; f < fl; f ++ ) {

				face = this.faces[ f ];

				if ( ! face.__originalFaceNormal ) {

					face.__originalFaceNormal = face.normal.clone();

				} else {

					face.__originalFaceNormal.copy( face.normal );

				}

				if ( ! face.__originalVertexNormals ) face.__originalVertexNormals = [];

				for ( i = 0, il = face.vertexNormals.length; i < il; i ++ ) {

					if ( ! face.__originalVertexNormals[ i ] ) {

						face.__originalVertexNormals[ i ] = face.vertexNormals[ i ].clone();

					} else {

						face.__originalVertexNormals[ i ].copy( face.vertexNormals[ i ] );

					}

				}

			}

			// use temp geometry to compute face and vertex normals for each morph

			var tmpGeo = new Geometry();
			tmpGeo.faces = this.faces;

			for ( i = 0, il = this.morphTargets.length; i < il; i ++ ) {

				// create on first access

				if ( ! this.morphNormals[ i ] ) {

					this.morphNormals[ i ] = {};
					this.morphNormals[ i ].faceNormals = [];
					this.morphNormals[ i ].vertexNormals = [];

					var dstNormalsFace = this.morphNormals[ i ].faceNormals;
					var dstNormalsVertex = this.morphNormals[ i ].vertexNormals;

					var faceNormal, vertexNormals;

					for ( f = 0, fl = this.faces.length; f < fl; f ++ ) {

						faceNormal = new Vector3();
						vertexNormals = { a: new Vector3(), b: new Vector3(), c: new Vector3() };

						dstNormalsFace.push( faceNormal );
						dstNormalsVertex.push( vertexNormals );

					}

				}

				var morphNormals = this.morphNormals[ i ];

				// set vertices to morph target

				tmpGeo.vertices = this.morphTargets[ i ].vertices;

				// compute morph normals

				tmpGeo.computeFaceNormals();
				tmpGeo.computeVertexNormals();

				// store morph normals

				var faceNormal, vertexNormals;

				for ( f = 0, fl = this.faces.length; f < fl; f ++ ) {

					face = this.faces[ f ];

					faceNormal = morphNormals.faceNormals[ f ];
					vertexNormals = morphNormals.vertexNormals[ f ];

					faceNormal.copy( face.normal );

					vertexNormals.a.copy( face.vertexNormals[ 0 ] );
					vertexNormals.b.copy( face.vertexNormals[ 1 ] );
					vertexNormals.c.copy( face.vertexNormals[ 2 ] );

				}

			}

			// restore original normals

			for ( f = 0, fl = this.faces.length; f < fl; f ++ ) {

				face = this.faces[ f ];

				face.normal = face.__originalFaceNormal;
				face.vertexNormals = face.__originalVertexNormals;

			}

		},

		computeLineDistances: function () {

			var d = 0;
			var vertices = this.vertices;

			for ( var i = 0, il = vertices.length; i < il; i ++ ) {

				if ( i > 0 ) {

					d += vertices[ i ].distanceTo( vertices[ i - 1 ] );

				}

				this.lineDistances[ i ] = d;

			}

		},

		computeBoundingBox: function () {

			if ( this.boundingBox === null ) {

				this.boundingBox = new Box3();

			}

			this.boundingBox.setFromPoints( this.vertices );

		},

		computeBoundingSphere: function () {

			if ( this.boundingSphere === null ) {

				this.boundingSphere = new Sphere();

			}

			this.boundingSphere.setFromPoints( this.vertices );

		},

		merge: function ( geometry, matrix, materialIndexOffset ) {

			if ( ! ( geometry && geometry.isGeometry ) ) {

				console.error( 'THREE.Geometry.merge(): geometry not an instance of THREE.Geometry.', geometry );
				return;

			}

			var normalMatrix,
				vertexOffset = this.vertices.length,
				vertices1 = this.vertices,
				vertices2 = geometry.vertices,
				faces1 = this.faces,
				faces2 = geometry.faces,
				uvs1 = this.faceVertexUvs[ 0 ],
				uvs2 = geometry.faceVertexUvs[ 0 ],
				colors1 = this.colors,
				colors2 = geometry.colors;

			if ( materialIndexOffset === undefined ) materialIndexOffset = 0;

			if ( matrix !== undefined ) {

				normalMatrix = new Matrix3().getNormalMatrix( matrix );

			}

			// vertices

			for ( var i = 0, il = vertices2.length; i < il; i ++ ) {

				var vertex = vertices2[ i ];

				var vertexCopy = vertex.clone();

				if ( matrix !== undefined ) vertexCopy.applyMatrix4( matrix );

				vertices1.push( vertexCopy );

			}

			// colors

			for ( var i = 0, il = colors2.length; i < il; i ++ ) {

				colors1.push( colors2[ i ].clone() );

			}

			// faces

			for ( i = 0, il = faces2.length; i < il; i ++ ) {

				var face = faces2[ i ], faceCopy, normal, color,
					faceVertexNormals = face.vertexNormals,
					faceVertexColors = face.vertexColors;

				faceCopy = new Face3( face.a + vertexOffset, face.b + vertexOffset, face.c + vertexOffset );
				faceCopy.normal.copy( face.normal );

				if ( normalMatrix !== undefined ) {

					faceCopy.normal.applyMatrix3( normalMatrix ).normalize();

				}

				for ( var j = 0, jl = faceVertexNormals.length; j < jl; j ++ ) {

					normal = faceVertexNormals[ j ].clone();

					if ( normalMatrix !== undefined ) {

						normal.applyMatrix3( normalMatrix ).normalize();

					}

					faceCopy.vertexNormals.push( normal );

				}

				faceCopy.color.copy( face.color );

				for ( var j = 0, jl = faceVertexColors.length; j < jl; j ++ ) {

					color = faceVertexColors[ j ];
					faceCopy.vertexColors.push( color.clone() );

				}

				faceCopy.materialIndex = face.materialIndex + materialIndexOffset;

				faces1.push( faceCopy );

			}

			// uvs

			for ( i = 0, il = uvs2.length; i < il; i ++ ) {

				var uv = uvs2[ i ], uvCopy = [];

				if ( uv === undefined ) {

					continue;

				}

				for ( var j = 0, jl = uv.length; j < jl; j ++ ) {

					uvCopy.push( uv[ j ].clone() );

				}

				uvs1.push( uvCopy );

			}

		},

		mergeMesh: function ( mesh ) {

			if ( ! ( mesh && mesh.isMesh ) ) {

				console.error( 'THREE.Geometry.mergeMesh(): mesh not an instance of THREE.Mesh.', mesh );
				return;

			}

			mesh.matrixAutoUpdate && mesh.updateMatrix();

			this.merge( mesh.geometry, mesh.matrix );

		},

		/*
		 * Checks for duplicate vertices with hashmap.
		 * Duplicated vertices are removed
		 * and faces' vertices are updated.
		 */

		mergeVertices: function () {

			var verticesMap = {}; // Hashmap for looking up vertices by position coordinates (and making sure they are unique)
			var unique = [], changes = [];

			var v, key;
			var precisionPoints = 4; // number of decimal points, e.g. 4 for epsilon of 0.0001
			var precision = Math.pow( 10, precisionPoints );
			var i, il, face;
			var indices, j, jl;

			for ( i = 0, il = this.vertices.length; i < il; i ++ ) {

				v = this.vertices[ i ];
				key = Math.round( v.x * precision ) + '_' + Math.round( v.y * precision ) + '_' + Math.round( v.z * precision );

				if ( verticesMap[ key ] === undefined ) {

					verticesMap[ key ] = i;
					unique.push( this.vertices[ i ] );
					changes[ i ] = unique.length - 1;

				} else {

					//console.log('Duplicate vertex found. ', i, ' could be using ', verticesMap[key]);
					changes[ i ] = changes[ verticesMap[ key ] ];

				}

			}


			// if faces are completely degenerate after merging vertices, we
			// have to remove them from the geometry.
			var faceIndicesToRemove = [];

			for ( i = 0, il = this.faces.length; i < il; i ++ ) {

				face = this.faces[ i ];

				face.a = changes[ face.a ];
				face.b = changes[ face.b ];
				face.c = changes[ face.c ];

				indices = [ face.a, face.b, face.c ];

				// if any duplicate vertices are found in a Face3
				// we have to remove the face as nothing can be saved
				for ( var n = 0; n < 3; n ++ ) {

					if ( indices[ n ] === indices[ ( n + 1 ) % 3 ] ) {

						faceIndicesToRemove.push( i );
						break;

					}

				}

			}

			for ( i = faceIndicesToRemove.length - 1; i >= 0; i -- ) {

				var idx = faceIndicesToRemove[ i ];

				this.faces.splice( idx, 1 );

				for ( j = 0, jl = this.faceVertexUvs.length; j < jl; j ++ ) {

					this.faceVertexUvs[ j ].splice( idx, 1 );

				}

			}

			// Use unique set of vertices

			var diff = this.vertices.length - unique.length;
			this.vertices = unique;
			return diff;

		},

		setFromPoints: function ( points ) {

			this.vertices = [];

			for ( var i = 0, l = points.length; i < l; i ++ ) {

				var point = points[ i ];
				this.vertices.push( new Vector3( point.x, point.y, point.z || 0 ) );

			}

			return this;

		},

		sortFacesByMaterialIndex: function () {

			var faces = this.faces;
			var length = faces.length;

			// tag faces

			for ( var i = 0; i < length; i ++ ) {

				faces[ i ]._id = i;

			}

			// sort faces

			function materialIndexSort( a, b ) {

				return a.materialIndex - b.materialIndex;

			}

			faces.sort( materialIndexSort );

			// sort uvs

			var uvs1 = this.faceVertexUvs[ 0 ];
			var uvs2 = this.faceVertexUvs[ 1 ];

			var newUvs1, newUvs2;

			if ( uvs1 && uvs1.length === length ) newUvs1 = [];
			if ( uvs2 && uvs2.length === length ) newUvs2 = [];

			for ( var i = 0; i < length; i ++ ) {

				var id = faces[ i ]._id;

				if ( newUvs1 ) newUvs1.push( uvs1[ id ] );
				if ( newUvs2 ) newUvs2.push( uvs2[ id ] );

			}

			if ( newUvs1 ) this.faceVertexUvs[ 0 ] = newUvs1;
			if ( newUvs2 ) this.faceVertexUvs[ 1 ] = newUvs2;

		},

		toJSON: function () {

			var data = {
				metadata: {
					version: 4.5,
					type: 'Geometry',
					generator: 'Geometry.toJSON'
				}
			};

			// standard Geometry serialization

			data.uuid = this.uuid;
			data.type = this.type;
			if ( this.name !== '' ) data.name = this.name;

			if ( this.parameters !== undefined ) {

				var parameters = this.parameters;

				for ( var key in parameters ) {

					if ( parameters[ key ] !== undefined ) data[ key ] = parameters[ key ];

				}

				return data;

			}

			var vertices = [];

			for ( var i = 0; i < this.vertices.length; i ++ ) {

				var vertex = this.vertices[ i ];
				vertices.push( vertex.x, vertex.y, vertex.z );

			}

			var faces = [];
			var normals = [];
			var normalsHash = {};
			var colors = [];
			var colorsHash = {};
			var uvs = [];
			var uvsHash = {};

			for ( var i = 0; i < this.faces.length; i ++ ) {

				var face = this.faces[ i ];

				var hasMaterial = true;
				var hasFaceUv = false; // deprecated
				var hasFaceVertexUv = this.faceVertexUvs[ 0 ][ i ] !== undefined;
				var hasFaceNormal = face.normal.length() > 0;
				var hasFaceVertexNormal = face.vertexNormals.length > 0;
				var hasFaceColor = face.color.r !== 1 || face.color.g !== 1 || face.color.b !== 1;
				var hasFaceVertexColor = face.vertexColors.length > 0;

				var faceType = 0;

				faceType = setBit( faceType, 0, 0 ); // isQuad
				faceType = setBit( faceType, 1, hasMaterial );
				faceType = setBit( faceType, 2, hasFaceUv );
				faceType = setBit( faceType, 3, hasFaceVertexUv );
				faceType = setBit( faceType, 4, hasFaceNormal );
				faceType = setBit( faceType, 5, hasFaceVertexNormal );
				faceType = setBit( faceType, 6, hasFaceColor );
				faceType = setBit( faceType, 7, hasFaceVertexColor );

				faces.push( faceType );
				faces.push( face.a, face.b, face.c );
				faces.push( face.materialIndex );

				if ( hasFaceVertexUv ) {

					var faceVertexUvs = this.faceVertexUvs[ 0 ][ i ];

					faces.push(
						getUvIndex( faceVertexUvs[ 0 ] ),
						getUvIndex( faceVertexUvs[ 1 ] ),
						getUvIndex( faceVertexUvs[ 2 ] )
					);

				}

				if ( hasFaceNormal ) {

					faces.push( getNormalIndex( face.normal ) );

				}

				if ( hasFaceVertexNormal ) {

					var vertexNormals = face.vertexNormals;

					faces.push(
						getNormalIndex( vertexNormals[ 0 ] ),
						getNormalIndex( vertexNormals[ 1 ] ),
						getNormalIndex( vertexNormals[ 2 ] )
					);

				}

				if ( hasFaceColor ) {

					faces.push( getColorIndex( face.color ) );

				}

				if ( hasFaceVertexColor ) {

					var vertexColors = face.vertexColors;

					faces.push(
						getColorIndex( vertexColors[ 0 ] ),
						getColorIndex( vertexColors[ 1 ] ),
						getColorIndex( vertexColors[ 2 ] )
					);

				}

			}

			function setBit( value, position, enabled ) {

				return enabled ? value | ( 1 << position ) : value & ( ~ ( 1 << position ) );

			}

			function getNormalIndex( normal ) {

				var hash = normal.x.toString() + normal.y.toString() + normal.z.toString();

				if ( normalsHash[ hash ] !== undefined ) {

					return normalsHash[ hash ];

				}

				normalsHash[ hash ] = normals.length / 3;
				normals.push( normal.x, normal.y, normal.z );

				return normalsHash[ hash ];

			}

			function getColorIndex( color ) {

				var hash = color.r.toString() + color.g.toString() + color.b.toString();

				if ( colorsHash[ hash ] !== undefined ) {

					return colorsHash[ hash ];

				}

				colorsHash[ hash ] = colors.length;
				colors.push( color.getHex() );

				return colorsHash[ hash ];

			}

			function getUvIndex( uv ) {

				var hash = uv.x.toString() + uv.y.toString();

				if ( uvsHash[ hash ] !== undefined ) {

					return uvsHash[ hash ];

				}

				uvsHash[ hash ] = uvs.length / 2;
				uvs.push( uv.x, uv.y );

				return uvsHash[ hash ];

			}

			data.data = {};

			data.data.vertices = vertices;
			data.data.normals = normals;
			if ( colors.length > 0 ) data.data.colors = colors;
			if ( uvs.length > 0 ) data.data.uvs = [ uvs ]; // temporal backward compatibility
			data.data.faces = faces;

			return data;

		},

		clone: function () {

			/*
			 // Handle primitives

			 var parameters = this.parameters;

			 if ( parameters !== undefined ) {

			 var values = [];

			 for ( var key in parameters ) {

			 values.push( parameters[ key ] );

			 }

			 var geometry = Object.create( this.constructor.prototype );
			 this.constructor.apply( geometry, values );
			 return geometry;

			 }

			 return new this.constructor().copy( this );
			 */

			return new Geometry().copy( this );

		},

		copy: function ( source ) {

			var i, il, j, jl, k, kl;

			// reset

			this.vertices = [];
			this.colors = [];
			this.faces = [];
			this.faceVertexUvs = [[]];
			this.morphTargets = [];
			this.morphNormals = [];
			this.skinWeights = [];
			this.skinIndices = [];
			this.lineDistances = [];
			this.boundingBox = null;
			this.boundingSphere = null;

			// name

			this.name = source.name;

			// vertices

			var vertices = source.vertices;

			for ( i = 0, il = vertices.length; i < il; i ++ ) {

				this.vertices.push( vertices[ i ].clone() );

			}

			// colors

			var colors = source.colors;

			for ( i = 0, il = colors.length; i < il; i ++ ) {

				this.colors.push( colors[ i ].clone() );

			}

			// faces

			var faces = source.faces;

			for ( i = 0, il = faces.length; i < il; i ++ ) {

				this.faces.push( faces[ i ].clone() );

			}

			// face vertex uvs

			for ( i = 0, il = source.faceVertexUvs.length; i < il; i ++ ) {

				var faceVertexUvs = source.faceVertexUvs[ i ];

				if ( this.faceVertexUvs[ i ] === undefined ) {

					this.faceVertexUvs[ i ] = [];

				}

				for ( j = 0, jl = faceVertexUvs.length; j < jl; j ++ ) {

					var uvs = faceVertexUvs[ j ], uvsCopy = [];

					for ( k = 0, kl = uvs.length; k < kl; k ++ ) {

						var uv = uvs[ k ];

						uvsCopy.push( uv.clone() );

					}

					this.faceVertexUvs[ i ].push( uvsCopy );

				}

			}

			// morph targets

			var morphTargets = source.morphTargets;

			for ( i = 0, il = morphTargets.length; i < il; i ++ ) {

				var morphTarget = {};
				morphTarget.name = morphTargets[ i ].name;

				// vertices

				if ( morphTargets[ i ].vertices !== undefined ) {

					morphTarget.vertices = [];

					for ( j = 0, jl = morphTargets[ i ].vertices.length; j < jl; j ++ ) {

						morphTarget.vertices.push( morphTargets[ i ].vertices[ j ].clone() );

					}

				}

				// normals

				if ( morphTargets[ i ].normals !== undefined ) {

					morphTarget.normals = [];

					for ( j = 0, jl = morphTargets[ i ].normals.length; j < jl; j ++ ) {

						morphTarget.normals.push( morphTargets[ i ].normals[ j ].clone() );

					}

				}

				this.morphTargets.push( morphTarget );

			}

			// morph normals

			var morphNormals = source.morphNormals;

			for ( i = 0, il = morphNormals.length; i < il; i ++ ) {

				var morphNormal = {};

				// vertex normals

				if ( morphNormals[ i ].vertexNormals !== undefined ) {

					morphNormal.vertexNormals = [];

					for ( j = 0, jl = morphNormals[ i ].vertexNormals.length; j < jl; j ++ ) {

						var srcVertexNormal = morphNormals[ i ].vertexNormals[ j ];
						var destVertexNormal = {};

						destVertexNormal.a = srcVertexNormal.a.clone();
						destVertexNormal.b = srcVertexNormal.b.clone();
						destVertexNormal.c = srcVertexNormal.c.clone();

						morphNormal.vertexNormals.push( destVertexNormal );

					}

				}

				// face normals

				if ( morphNormals[ i ].faceNormals !== undefined ) {

					morphNormal.faceNormals = [];

					for ( j = 0, jl = morphNormals[ i ].faceNormals.length; j < jl; j ++ ) {

						morphNormal.faceNormals.push( morphNormals[ i ].faceNormals[ j ].clone() );

					}

				}

				this.morphNormals.push( morphNormal );

			}

			// skin weights

			var skinWeights = source.skinWeights;

			for ( i = 0, il = skinWeights.length; i < il; i ++ ) {

				this.skinWeights.push( skinWeights[ i ].clone() );

			}

			// skin indices

			var skinIndices = source.skinIndices;

			for ( i = 0, il = skinIndices.length; i < il; i ++ ) {

				this.skinIndices.push( skinIndices[ i ].clone() );

			}

			// line distances

			var lineDistances = source.lineDistances;

			for ( i = 0, il = lineDistances.length; i < il; i ++ ) {

				this.lineDistances.push( lineDistances[ i ] );

			}

			// bounding box

			var boundingBox = source.boundingBox;

			if ( boundingBox !== null ) {

				this.boundingBox = boundingBox.clone();

			}

			// bounding sphere

			var boundingSphere = source.boundingSphere;

			if ( boundingSphere !== null ) {

				this.boundingSphere = boundingSphere.clone();

			}

			// update flags

			this.elementsNeedUpdate = source.elementsNeedUpdate;
			this.verticesNeedUpdate = source.verticesNeedUpdate;
			this.uvsNeedUpdate = source.uvsNeedUpdate;
			this.normalsNeedUpdate = source.normalsNeedUpdate;
			this.colorsNeedUpdate = source.colorsNeedUpdate;
			this.lineDistancesNeedUpdate = source.lineDistancesNeedUpdate;
			this.groupsNeedUpdate = source.groupsNeedUpdate;

			return this;

		},

		dispose: function () {

			this.dispatchEvent( { type: 'dispose' } );

		}

	} );

	/**
	 * @author supereggbert / http://www.paulbrunt.co.uk/
	 * @author philogb / http://blog.thejit.org/
	 * @author mikael emtinger / http://gomo.se/
	 * @author egraether / http://egraether.com/
	 * @author WestLangley / http://github.com/WestLangley
	 */

	function Vector4( x, y, z, w ) {

		this.x = x || 0;
		this.y = y || 0;
		this.z = z || 0;
		this.w = ( w !== undefined ) ? w : 1;

	}

	Object.assign( Vector4.prototype, {

		isVector4: true,

		set: function ( x, y, z, w ) {

			this.x = x;
			this.y = y;
			this.z = z;
			this.w = w;

			return this;

		},

		setScalar: function ( scalar ) {

			this.x = scalar;
			this.y = scalar;
			this.z = scalar;
			this.w = scalar;

			return this;

		},

		setX: function ( x ) {

			this.x = x;

			return this;

		},

		setY: function ( y ) {

			this.y = y;

			return this;

		},

		setZ: function ( z ) {

			this.z = z;

			return this;

		},

		setW: function ( w ) {

			this.w = w;

			return this;

		},

		setComponent: function ( index, value ) {

			switch ( index ) {

				case 0: this.x = value; break;
				case 1: this.y = value; break;
				case 2: this.z = value; break;
				case 3: this.w = value; break;
				default: throw new Error( 'index is out of range: ' + index );

			}

			return this;

		},

		getComponent: function ( index ) {

			switch ( index ) {

				case 0: return this.x;
				case 1: return this.y;
				case 2: return this.z;
				case 3: return this.w;
				default: throw new Error( 'index is out of range: ' + index );

			}

		},

		clone: function () {

			return new this.constructor( this.x, this.y, this.z, this.w );

		},

		copy: function ( v ) {

			this.x = v.x;
			this.y = v.y;
			this.z = v.z;
			this.w = ( v.w !== undefined ) ? v.w : 1;

			return this;

		},

		add: function ( v, w ) {

			if ( w !== undefined ) {

				console.warn( 'THREE.Vector4: .add() now only accepts one argument. Use .addVectors( a, b ) instead.' );
				return this.addVectors( v, w );

			}

			this.x += v.x;
			this.y += v.y;
			this.z += v.z;
			this.w += v.w;

			return this;

		},

		addScalar: function ( s ) {

			this.x += s;
			this.y += s;
			this.z += s;
			this.w += s;

			return this;

		},

		addVectors: function ( a, b ) {

			this.x = a.x + b.x;
			this.y = a.y + b.y;
			this.z = a.z + b.z;
			this.w = a.w + b.w;

			return this;

		},

		addScaledVector: function ( v, s ) {

			this.x += v.x * s;
			this.y += v.y * s;
			this.z += v.z * s;
			this.w += v.w * s;

			return this;

		},

		sub: function ( v, w ) {

			if ( w !== undefined ) {

				console.warn( 'THREE.Vector4: .sub() now only accepts one argument. Use .subVectors( a, b ) instead.' );
				return this.subVectors( v, w );

			}

			this.x -= v.x;
			this.y -= v.y;
			this.z -= v.z;
			this.w -= v.w;

			return this;

		},

		subScalar: function ( s ) {

			this.x -= s;
			this.y -= s;
			this.z -= s;
			this.w -= s;

			return this;

		},

		subVectors: function ( a, b ) {

			this.x = a.x - b.x;
			this.y = a.y - b.y;
			this.z = a.z - b.z;
			this.w = a.w - b.w;

			return this;

		},

		multiplyScalar: function ( scalar ) {

			this.x *= scalar;
			this.y *= scalar;
			this.z *= scalar;
			this.w *= scalar;

			return this;

		},

		applyMatrix4: function ( m ) {

			var x = this.x, y = this.y, z = this.z, w = this.w;
			var e = m.elements;

			this.x = e[ 0 ] * x + e[ 4 ] * y + e[ 8 ] * z + e[ 12 ] * w;
			this.y = e[ 1 ] * x + e[ 5 ] * y + e[ 9 ] * z + e[ 13 ] * w;
			this.z = e[ 2 ] * x + e[ 6 ] * y + e[ 10 ] * z + e[ 14 ] * w;
			this.w = e[ 3 ] * x + e[ 7 ] * y + e[ 11 ] * z + e[ 15 ] * w;

			return this;

		},

		divideScalar: function ( scalar ) {

			return this.multiplyScalar( 1 / scalar );

		},

		setAxisAngleFromQuaternion: function ( q ) {

			// http://www.euclideanspace.com/maths/geometry/rotations/conversions/quaternionToAngle/index.htm

			// q is assumed to be normalized

			this.w = 2 * Math.acos( q.w );

			var s = Math.sqrt( 1 - q.w * q.w );

			if ( s < 0.0001 ) {

				this.x = 1;
				this.y = 0;
				this.z = 0;

			} else {

				this.x = q.x / s;
				this.y = q.y / s;
				this.z = q.z / s;

			}

			return this;

		},

		setAxisAngleFromRotationMatrix: function ( m ) {

			// http://www.euclideanspace.com/maths/geometry/rotations/conversions/matrixToAngle/index.htm

			// assumes the upper 3x3 of m is a pure rotation matrix (i.e, unscaled)

			var angle, x, y, z,		// variables for result
				epsilon = 0.01,		// margin to allow for rounding errors
				epsilon2 = 0.1,		// margin to distinguish between 0 and 180 degrees

				te = m.elements,

				m11 = te[ 0 ], m12 = te[ 4 ], m13 = te[ 8 ],
				m21 = te[ 1 ], m22 = te[ 5 ], m23 = te[ 9 ],
				m31 = te[ 2 ], m32 = te[ 6 ], m33 = te[ 10 ];

			if ( ( Math.abs( m12 - m21 ) < epsilon ) &&
			     ( Math.abs( m13 - m31 ) < epsilon ) &&
			     ( Math.abs( m23 - m32 ) < epsilon ) ) {

				// singularity found
				// first check for identity matrix which must have +1 for all terms
				// in leading diagonal and zero in other terms

				if ( ( Math.abs( m12 + m21 ) < epsilon2 ) &&
				     ( Math.abs( m13 + m31 ) < epsilon2 ) &&
				     ( Math.abs( m23 + m32 ) < epsilon2 ) &&
				     ( Math.abs( m11 + m22 + m33 - 3 ) < epsilon2 ) ) {

					// this singularity is identity matrix so angle = 0

					this.set( 1, 0, 0, 0 );

					return this; // zero angle, arbitrary axis

				}

				// otherwise this singularity is angle = 180

				angle = Math.PI;

				var xx = ( m11 + 1 ) / 2;
				var yy = ( m22 + 1 ) / 2;
				var zz = ( m33 + 1 ) / 2;
				var xy = ( m12 + m21 ) / 4;
				var xz = ( m13 + m31 ) / 4;
				var yz = ( m23 + m32 ) / 4;

				if ( ( xx > yy ) && ( xx > zz ) ) {

					// m11 is the largest diagonal term

					if ( xx < epsilon ) {

						x = 0;
						y = 0.707106781;
						z = 0.707106781;

					} else {

						x = Math.sqrt( xx );
						y = xy / x;
						z = xz / x;

					}

				} else if ( yy > zz ) {

					// m22 is the largest diagonal term

					if ( yy < epsilon ) {

						x = 0.707106781;
						y = 0;
						z = 0.707106781;

					} else {

						y = Math.sqrt( yy );
						x = xy / y;
						z = yz / y;

					}

				} else {

					// m33 is the largest diagonal term so base result on this

					if ( zz < epsilon ) {

						x = 0.707106781;
						y = 0.707106781;
						z = 0;

					} else {

						z = Math.sqrt( zz );
						x = xz / z;
						y = yz / z;

					}

				}

				this.set( x, y, z, angle );

				return this; // return 180 deg rotation

			}

			// as we have reached here there are no singularities so we can handle normally

			var s = Math.sqrt( ( m32 - m23 ) * ( m32 - m23 ) +
			                   ( m13 - m31 ) * ( m13 - m31 ) +
			                   ( m21 - m12 ) * ( m21 - m12 ) ); // used to normalize

			if ( Math.abs( s ) < 0.001 ) s = 1;

			// prevent divide by zero, should not happen if matrix is orthogonal and should be
			// caught by singularity test above, but I've left it in just in case

			this.x = ( m32 - m23 ) / s;
			this.y = ( m13 - m31 ) / s;
			this.z = ( m21 - m12 ) / s;
			this.w = Math.acos( ( m11 + m22 + m33 - 1 ) / 2 );

			return this;

		},

		min: function ( v ) {

			this.x = Math.min( this.x, v.x );
			this.y = Math.min( this.y, v.y );
			this.z = Math.min( this.z, v.z );
			this.w = Math.min( this.w, v.w );

			return this;

		},

		max: function ( v ) {

			this.x = Math.max( this.x, v.x );
			this.y = Math.max( this.y, v.y );
			this.z = Math.max( this.z, v.z );
			this.w = Math.max( this.w, v.w );

			return this;

		},

		clamp: function ( min, max ) {

			// assumes min < max, componentwise

			this.x = Math.max( min.x, Math.min( max.x, this.x ) );
			this.y = Math.max( min.y, Math.min( max.y, this.y ) );
			this.z = Math.max( min.z, Math.min( max.z, this.z ) );
			this.w = Math.max( min.w, Math.min( max.w, this.w ) );

			return this;

		},

		clampScalar: function () {

			var min, max;

			return function clampScalar( minVal, maxVal ) {

				if ( min === undefined ) {

					min = new Vector4();
					max = new Vector4();

				}

				min.set( minVal, minVal, minVal, minVal );
				max.set( maxVal, maxVal, maxVal, maxVal );

				return this.clamp( min, max );

			};

		}(),

		clampLength: function ( min, max ) {

			var length = this.length();

			return this.divideScalar( length || 1 ).multiplyScalar( Math.max( min, Math.min( max, length ) ) );

		},

		floor: function () {

			this.x = Math.floor( this.x );
			this.y = Math.floor( this.y );
			this.z = Math.floor( this.z );
			this.w = Math.floor( this.w );

			return this;

		},

		ceil: function () {

			this.x = Math.ceil( this.x );
			this.y = Math.ceil( this.y );
			this.z = Math.ceil( this.z );
			this.w = Math.ceil( this.w );

			return this;

		},

		round: function () {

			this.x = Math.round( this.x );
			this.y = Math.round( this.y );
			this.z = Math.round( this.z );
			this.w = Math.round( this.w );

			return this;

		},

		roundToZero: function () {

			this.x = ( this.x < 0 ) ? Math.ceil( this.x ) : Math.floor( this.x );
			this.y = ( this.y < 0 ) ? Math.ceil( this.y ) : Math.floor( this.y );
			this.z = ( this.z < 0 ) ? Math.ceil( this.z ) : Math.floor( this.z );
			this.w = ( this.w < 0 ) ? Math.ceil( this.w ) : Math.floor( this.w );

			return this;

		},

		negate: function () {

			this.x = - this.x;
			this.y = - this.y;
			this.z = - this.z;
			this.w = - this.w;

			return this;

		},

		dot: function ( v ) {

			return this.x * v.x + this.y * v.y + this.z * v.z + this.w * v.w;

		},

		lengthSq: function () {

			return this.x * this.x + this.y * this.y + this.z * this.z + this.w * this.w;

		},

		length: function () {

			return Math.sqrt( this.x * this.x + this.y * this.y + this.z * this.z + this.w * this.w );

		},

		manhattanLength: function () {

			return Math.abs( this.x ) + Math.abs( this.y ) + Math.abs( this.z ) + Math.abs( this.w );

		},

		normalize: function () {

			return this.divideScalar( this.length() || 1 );

		},

		setLength: function ( length ) {

			return this.normalize().multiplyScalar( length );

		},

		lerp: function ( v, alpha ) {

			this.x += ( v.x - this.x ) * alpha;
			this.y += ( v.y - this.y ) * alpha;
			this.z += ( v.z - this.z ) * alpha;
			this.w += ( v.w - this.w ) * alpha;

			return this;

		},

		lerpVectors: function ( v1, v2, alpha ) {

			return this.subVectors( v2, v1 ).multiplyScalar( alpha ).add( v1 );

		},

		equals: function ( v ) {

			return ( ( v.x === this.x ) && ( v.y === this.y ) && ( v.z === this.z ) && ( v.w === this.w ) );

		},

		fromArray: function ( array, offset ) {

			if ( offset === undefined ) offset = 0;

			this.x = array[ offset ];
			this.y = array[ offset + 1 ];
			this.z = array[ offset + 2 ];
			this.w = array[ offset + 3 ];

			return this;

		},

		toArray: function ( array, offset ) {

			if ( array === undefined ) array = [];
			if ( offset === undefined ) offset = 0;

			array[ offset ] = this.x;
			array[ offset + 1 ] = this.y;
			array[ offset + 2 ] = this.z;
			array[ offset + 3 ] = this.w;

			return array;

		},

		fromBufferAttribute: function ( attribute, index, offset ) {

			if ( offset !== undefined ) {

				console.warn( 'THREE.Vector4: offset has been removed from .fromBufferAttribute().' );

			}

			this.x = attribute.getX( index );
			this.y = attribute.getY( index );
			this.z = attribute.getZ( index );
			this.w = attribute.getW( index );

			return this;

		}

	} );

	/**
	 * @author mrdoob / http://mrdoob.com/
	 */

	function BufferAttribute( array, itemSize, normalized ) {

		if ( Array.isArray( array ) ) {

			throw new TypeError( 'THREE.BufferAttribute: array should be a Typed Array.' );

		}

		this.uuid = _Math.generateUUID();
		this.name = '';

		this.array = array;
		this.itemSize = itemSize;
		this.count = array !== undefined ? array.length / itemSize : 0;
		this.normalized = normalized === true;

		this.dynamic = false;
		this.updateRange = { offset: 0, count: - 1 };

		this.onUploadCallback = function () {};

		this.version = 0;

	}

	Object.defineProperty( BufferAttribute.prototype, 'needsUpdate', {

		set: function ( value ) {

			if ( value === true ) this.version ++;

		}

	} );

	Object.assign( BufferAttribute.prototype, {

		isBufferAttribute: true,

		setArray: function ( array ) {

			if ( Array.isArray( array ) ) {

				throw new TypeError( 'THREE.BufferAttribute: array should be a Typed Array.' );

			}

			this.count = array !== undefined ? array.length / this.itemSize : 0;
			this.array = array;

		},

		setDynamic: function ( value ) {

			this.dynamic = value;

			return this;

		},

		copy: function ( source ) {

			this.array = new source.array.constructor( source.array );
			this.itemSize = source.itemSize;
			this.count = source.count;
			this.normalized = source.normalized;

			this.dynamic = source.dynamic;

			return this;

		},

		copyAt: function ( index1, attribute, index2 ) {

			index1 *= this.itemSize;
			index2 *= attribute.itemSize;

			for ( var i = 0, l = this.itemSize; i < l; i ++ ) {

				this.array[ index1 + i ] = attribute.array[ index2 + i ];

			}

			return this;

		},

		copyArray: function ( array ) {

			this.array.set( array );

			return this;

		},

		copyColorsArray: function ( colors ) {

			var array = this.array, offset = 0;

			for ( var i = 0, l = colors.length; i < l; i ++ ) {

				var color = colors[ i ];

				if ( color === undefined ) {

					console.warn( 'THREE.BufferAttribute.copyColorsArray(): color is undefined', i );
					color = new Color();

				}

				array[ offset ++ ] = color.r;
				array[ offset ++ ] = color.g;
				array[ offset ++ ] = color.b;

			}

			return this;

		},

		copyIndicesArray: function ( indices ) {

			var array = this.array, offset = 0;

			for ( var i = 0, l = indices.length; i < l; i ++ ) {

				var index = indices[ i ];

				array[ offset ++ ] = index.a;
				array[ offset ++ ] = index.b;
				array[ offset ++ ] = index.c;

			}

			return this;

		},

		copyVector2sArray: function ( vectors ) {

			var array = this.array, offset = 0;

			for ( var i = 0, l = vectors.length; i < l; i ++ ) {

				var vector = vectors[ i ];

				if ( vector === undefined ) {

					console.warn( 'THREE.BufferAttribute.copyVector2sArray(): vector is undefined', i );
					vector = new Vector2();

				}

				array[ offset ++ ] = vector.x;
				array[ offset ++ ] = vector.y;

			}

			return this;

		},

		copyVector3sArray: function ( vectors ) {

			var array = this.array, offset = 0;

			for ( var i = 0, l = vectors.length; i < l; i ++ ) {

				var vector = vectors[ i ];

				if ( vector === undefined ) {

					console.warn( 'THREE.BufferAttribute.copyVector3sArray(): vector is undefined', i );
					vector = new Vector3();

				}

				array[ offset ++ ] = vector.x;
				array[ offset ++ ] = vector.y;
				array[ offset ++ ] = vector.z;

			}

			return this;

		},

		copyVector4sArray: function ( vectors ) {

			var array = this.array, offset = 0;

			for ( var i = 0, l = vectors.length; i < l; i ++ ) {

				var vector = vectors[ i ];

				if ( vector === undefined ) {

					console.warn( 'THREE.BufferAttribute.copyVector4sArray(): vector is undefined', i );
					vector = new Vector4();

				}

				array[ offset ++ ] = vector.x;
				array[ offset ++ ] = vector.y;
				array[ offset ++ ] = vector.z;
				array[ offset ++ ] = vector.w;

			}

			return this;

		},

		set: function ( value, offset ) {

			if ( offset === undefined ) offset = 0;

			this.array.set( value, offset );

			return this;

		},

		getX: function ( index ) {

			return this.array[ index * this.itemSize ];

		},

		setX: function ( index, x ) {

			this.array[ index * this.itemSize ] = x;

			return this;

		},

		getY: function ( index ) {

			return this.array[ index * this.itemSize + 1 ];

		},

		setY: function ( index, y ) {

			this.array[ index * this.itemSize + 1 ] = y;

			return this;

		},

		getZ: function ( index ) {

			return this.array[ index * this.itemSize + 2 ];

		},

		setZ: function ( index, z ) {

			this.array[ index * this.itemSize + 2 ] = z;

			return this;

		},

		getW: function ( index ) {

			return this.array[ index * this.itemSize + 3 ];

		},

		setW: function ( index, w ) {

			this.array[ index * this.itemSize + 3 ] = w;

			return this;

		},

		setXY: function ( index, x, y ) {

			index *= this.itemSize;

			this.array[ index + 0 ] = x;
			this.array[ index + 1 ] = y;

			return this;

		},

		setXYZ: function ( index, x, y, z ) {

			index *= this.itemSize;

			this.array[ index + 0 ] = x;
			this.array[ index + 1 ] = y;
			this.array[ index + 2 ] = z;

			return this;

		},

		setXYZW: function ( index, x, y, z, w ) {

			index *= this.itemSize;

			this.array[ index + 0 ] = x;
			this.array[ index + 1 ] = y;
			this.array[ index + 2 ] = z;
			this.array[ index + 3 ] = w;

			return this;

		},

		onUpload: function ( callback ) {

			this.onUploadCallback = callback;

			return this;

		},

		clone: function () {

			return new this.constructor( this.array, this.itemSize ).copy( this );

		}

	} );

	//

	function Int8BufferAttribute( array, itemSize, normalized ) {

		BufferAttribute.call( this, new Int8Array( array ), itemSize, normalized );

	}

	Int8BufferAttribute.prototype = Object.create( BufferAttribute.prototype );
	Int8BufferAttribute.prototype.constructor = Int8BufferAttribute;


	function Uint8BufferAttribute( array, itemSize, normalized ) {

		BufferAttribute.call( this, new Uint8Array( array ), itemSize, normalized );

	}

	Uint8BufferAttribute.prototype = Object.create( BufferAttribute.prototype );
	Uint8BufferAttribute.prototype.constructor = Uint8BufferAttribute;


	function Uint8ClampedBufferAttribute( array, itemSize, normalized ) {

		BufferAttribute.call( this, new Uint8ClampedArray( array ), itemSize, normalized );

	}

	Uint8ClampedBufferAttribute.prototype = Object.create( BufferAttribute.prototype );
	Uint8ClampedBufferAttribute.prototype.constructor = Uint8ClampedBufferAttribute;


	function Int16BufferAttribute( array, itemSize, normalized ) {

		BufferAttribute.call( this, new Int16Array( array ), itemSize, normalized );

	}

	Int16BufferAttribute.prototype = Object.create( BufferAttribute.prototype );
	Int16BufferAttribute.prototype.constructor = Int16BufferAttribute;


	function Uint16BufferAttribute( array, itemSize, normalized ) {

		BufferAttribute.call( this, new Uint16Array( array ), itemSize, normalized );

	}

	Uint16BufferAttribute.prototype = Object.create( BufferAttribute.prototype );
	Uint16BufferAttribute.prototype.constructor = Uint16BufferAttribute;


	function Int32BufferAttribute( array, itemSize, normalized ) {

		BufferAttribute.call( this, new Int32Array( array ), itemSize, normalized );

	}

	Int32BufferAttribute.prototype = Object.create( BufferAttribute.prototype );
	Int32BufferAttribute.prototype.constructor = Int32BufferAttribute;


	function Uint32BufferAttribute( array, itemSize, normalized ) {

		BufferAttribute.call( this, new Uint32Array( array ), itemSize, normalized );

	}

	Uint32BufferAttribute.prototype = Object.create( BufferAttribute.prototype );
	Uint32BufferAttribute.prototype.constructor = Uint32BufferAttribute;


	function Float32BufferAttribute( array, itemSize, normalized ) {

		BufferAttribute.call( this, new Float32Array( array ), itemSize, normalized );

	}

	Float32BufferAttribute.prototype = Object.create( BufferAttribute.prototype );
	Float32BufferAttribute.prototype.constructor = Float32BufferAttribute;


	function Float64BufferAttribute( array, itemSize, normalized ) {

		BufferAttribute.call( this, new Float64Array( array ), itemSize, normalized );

	}

	Float64BufferAttribute.prototype = Object.create( BufferAttribute.prototype );
	Float64BufferAttribute.prototype.constructor = Float64BufferAttribute;

	/**
	 * @author mrdoob / http://mrdoob.com/
	 */

	function DirectGeometry() {

		this.indices = [];
		this.vertices = [];
		this.normals = [];
		this.colors = [];
		this.uvs = [];
		this.uvs2 = [];

		this.groups = [];

		this.morphTargets = {};

		this.skinWeights = [];
		this.skinIndices = [];

		// this.lineDistances = [];

		this.boundingBox = null;
		this.boundingSphere = null;

		// update flags

		this.verticesNeedUpdate = false;
		this.normalsNeedUpdate = false;
		this.colorsNeedUpdate = false;
		this.uvsNeedUpdate = false;
		this.groupsNeedUpdate = false;

	}

	Object.assign( DirectGeometry.prototype, {

		computeGroups: function ( geometry ) {

			var group;
			var groups = [];
			var materialIndex = undefined;

			var faces = geometry.faces;

			for ( var i = 0; i < faces.length; i ++ ) {

				var face = faces[ i ];

				// materials

				if ( face.materialIndex !== materialIndex ) {

					materialIndex = face.materialIndex;

					if ( group !== undefined ) {

						group.count = ( i * 3 ) - group.start;
						groups.push( group );

					}

					group = {
						start: i * 3,
						materialIndex: materialIndex
					};

				}

			}

			if ( group !== undefined ) {

				group.count = ( i * 3 ) - group.start;
				groups.push( group );

			}

			this.groups = groups;

		},

		fromGeometry: function ( geometry ) {

			var faces = geometry.faces;
			var vertices = geometry.vertices;
			var faceVertexUvs = geometry.faceVertexUvs;

			var hasFaceVertexUv = faceVertexUvs[ 0 ] && faceVertexUvs[ 0 ].length > 0;
			var hasFaceVertexUv2 = faceVertexUvs[ 1 ] && faceVertexUvs[ 1 ].length > 0;

			// morphs

			var morphTargets = geometry.morphTargets;
			var morphTargetsLength = morphTargets.length;

			var morphTargetsPosition;

			if ( morphTargetsLength > 0 ) {

				morphTargetsPosition = [];

				for ( var i = 0; i < morphTargetsLength; i ++ ) {

					morphTargetsPosition[ i ] = [];

				}

				this.morphTargets.position = morphTargetsPosition;

			}

			var morphNormals = geometry.morphNormals;
			var morphNormalsLength = morphNormals.length;

			var morphTargetsNormal;

			if ( morphNormalsLength > 0 ) {

				morphTargetsNormal = [];

				for ( var i = 0; i < morphNormalsLength; i ++ ) {

					morphTargetsNormal[ i ] = [];

				}

				this.morphTargets.normal = morphTargetsNormal;

			}

			// skins

			var skinIndices = geometry.skinIndices;
			var skinWeights = geometry.skinWeights;

			var hasSkinIndices = skinIndices.length === vertices.length;
			var hasSkinWeights = skinWeights.length === vertices.length;

			//

			for ( var i = 0; i < faces.length; i ++ ) {

				var face = faces[ i ];

				this.vertices.push( vertices[ face.a ], vertices[ face.b ], vertices[ face.c ] );

				var vertexNormals = face.vertexNormals;

				if ( vertexNormals.length === 3 ) {

					this.normals.push( vertexNormals[ 0 ], vertexNormals[ 1 ], vertexNormals[ 2 ] );

				} else {

					var normal = face.normal;

					this.normals.push( normal, normal, normal );

				}

				var vertexColors = face.vertexColors;

				if ( vertexColors.length === 3 ) {

					this.colors.push( vertexColors[ 0 ], vertexColors[ 1 ], vertexColors[ 2 ] );

				} else {

					var color = face.color;

					this.colors.push( color, color, color );

				}

				if ( hasFaceVertexUv === true ) {

					var vertexUvs = faceVertexUvs[ 0 ][ i ];

					if ( vertexUvs !== undefined ) {

						this.uvs.push( vertexUvs[ 0 ], vertexUvs[ 1 ], vertexUvs[ 2 ] );

					} else {

						console.warn( 'THREE.DirectGeometry.fromGeometry(): Undefined vertexUv ', i );

						this.uvs.push( new Vector2(), new Vector2(), new Vector2() );

					}

				}

				if ( hasFaceVertexUv2 === true ) {

					var vertexUvs = faceVertexUvs[ 1 ][ i ];

					if ( vertexUvs !== undefined ) {

						this.uvs2.push( vertexUvs[ 0 ], vertexUvs[ 1 ], vertexUvs[ 2 ] );

					} else {

						console.warn( 'THREE.DirectGeometry.fromGeometry(): Undefined vertexUv2 ', i );

						this.uvs2.push( new Vector2(), new Vector2(), new Vector2() );

					}

				}

				// morphs

				for ( var j = 0; j < morphTargetsLength; j ++ ) {

					var morphTarget = morphTargets[ j ].vertices;

					morphTargetsPosition[ j ].push( morphTarget[ face.a ], morphTarget[ face.b ], morphTarget[ face.c ] );

				}

				for ( var j = 0; j < morphNormalsLength; j ++ ) {

					var morphNormal = morphNormals[ j ].vertexNormals[ i ];

					morphTargetsNormal[ j ].push( morphNormal.a, morphNormal.b, morphNormal.c );

				}

				// skins

				if ( hasSkinIndices ) {

					this.skinIndices.push( skinIndices[ face.a ], skinIndices[ face.b ], skinIndices[ face.c ] );

				}

				if ( hasSkinWeights ) {

					this.skinWeights.push( skinWeights[ face.a ], skinWeights[ face.b ], skinWeights[ face.c ] );

				}

			}

			this.computeGroups( geometry );

			this.verticesNeedUpdate = geometry.verticesNeedUpdate;
			this.normalsNeedUpdate = geometry.normalsNeedUpdate;
			this.colorsNeedUpdate = geometry.colorsNeedUpdate;
			this.uvsNeedUpdate = geometry.uvsNeedUpdate;
			this.groupsNeedUpdate = geometry.groupsNeedUpdate;

			return this;

		}

	} );

	/**
	 * @author mrdoob / http://mrdoob.com/
	 */

	function arrayMax( array ) {

		if ( array.length === 0 ) return - Infinity;

		var max = array[ 0 ];

		for ( var i = 1, l = array.length; i < l; ++ i ) {

			if ( array[ i ] > max ) max = array[ i ];

		}

		return max;

	}

	/**
	 * @author alteredq / http://alteredqualia.com/
	 * @author mrdoob / http://mrdoob.com/
	 */

	var bufferGeometryId = 1; // BufferGeometry uses odd numbers as Id

	function BufferGeometry() {

		Object.defineProperty( this, 'id', { value: bufferGeometryId += 2 } );

		this.uuid = _Math.generateUUID();

		this.name = '';
		this.type = 'BufferGeometry';

		this.index = null;
		this.attributes = {};

		this.morphAttributes = {};

		this.groups = [];

		this.boundingBox = null;
		this.boundingSphere = null;

		this.drawRange = { start: 0, count: Infinity };

	}

	Object.assign( BufferGeometry.prototype, EventDispatcher.prototype, {

		isBufferGeometry: true,

		getIndex: function () {

			return this.index;

		},

		setIndex: function ( index ) {

			if ( Array.isArray( index ) ) {

				this.index = new ( arrayMax( index ) > 65535 ? Uint32BufferAttribute : Uint16BufferAttribute )( index, 1 );

			} else {

				this.index = index;

			}

		},

		addAttribute: function ( name, attribute ) {

			if ( ! ( attribute && attribute.isBufferAttribute ) && ! ( attribute && attribute.isInterleavedBufferAttribute ) ) {

				console.warn( 'THREE.BufferGeometry: .addAttribute() now expects ( name, attribute ).' );

				this.addAttribute( name, new BufferAttribute( arguments[ 1 ], arguments[ 2 ] ) );

				return;

			}

			if ( name === 'index' ) {

				console.warn( 'THREE.BufferGeometry.addAttribute: Use .setIndex() for index attribute.' );
				this.setIndex( attribute );

				return;

			}

			this.attributes[ name ] = attribute;

			return this;

		},

		getAttribute: function ( name ) {

			return this.attributes[ name ];

		},

		removeAttribute: function ( name ) {

			delete this.attributes[ name ];

			return this;

		},

		addGroup: function ( start, count, materialIndex ) {

			this.groups.push( {

				start: start,
				count: count,
				materialIndex: materialIndex !== undefined ? materialIndex : 0

			} );

		},

		clearGroups: function () {

			this.groups = [];

		},

		setDrawRange: function ( start, count ) {

			this.drawRange.start = start;
			this.drawRange.count = count;

		},

		applyMatrix: function ( matrix ) {

			var position = this.attributes.position;

			if ( position !== undefined ) {

				matrix.applyToBufferAttribute( position );
				position.needsUpdate = true;

			}

			var normal = this.attributes.normal;

			if ( normal !== undefined ) {

				var normalMatrix = new Matrix3().getNormalMatrix( matrix );

				normalMatrix.applyToBufferAttribute( normal );
				normal.needsUpdate = true;

			}

			if ( this.boundingBox !== null ) {

				this.computeBoundingBox();

			}

			if ( this.boundingSphere !== null ) {

				this.computeBoundingSphere();

			}

			return this;

		},

		rotateX: function () {

			// rotate geometry around world x-axis

			var m1 = new Matrix4();

			return function rotateX( angle ) {

				m1.makeRotationX( angle );

				this.applyMatrix( m1 );

				return this;

			};

		}(),

		rotateY: function () {

			// rotate geometry around world y-axis

			var m1 = new Matrix4();

			return function rotateY( angle ) {

				m1.makeRotationY( angle );

				this.applyMatrix( m1 );

				return this;

			};

		}(),

		rotateZ: function () {

			// rotate geometry around world z-axis

			var m1 = new Matrix4();

			return function rotateZ( angle ) {

				m1.makeRotationZ( angle );

				this.applyMatrix( m1 );

				return this;

			};

		}(),

		translate: function () {

			// translate geometry

			var m1 = new Matrix4();

			return function translate( x, y, z ) {

				m1.makeTranslation( x, y, z );

				this.applyMatrix( m1 );

				return this;

			};

		}(),

		scale: function () {

			// scale geometry

			var m1 = new Matrix4();

			return function scale( x, y, z ) {

				m1.makeScale( x, y, z );

				this.applyMatrix( m1 );

				return this;

			};

		}(),

		lookAt: function () {

			var obj = new Object3D();

			return function lookAt( vector ) {

				obj.lookAt( vector );

				obj.updateMatrix();

				this.applyMatrix( obj.matrix );

			};

		}(),

		center: function () {

			this.computeBoundingBox();

			var offset = this.boundingBox.getCenter().negate();

			this.translate( offset.x, offset.y, offset.z );

			return offset;

		},

		setFromObject: function ( object ) {

			// console.log( 'THREE.BufferGeometry.setFromObject(). Converting', object, this );

			var geometry = object.geometry;

			if ( object.isPoints || object.isLine ) {

				var positions = new Float32BufferAttribute( geometry.vertices.length * 3, 3 );
				var colors = new Float32BufferAttribute( geometry.colors.length * 3, 3 );

				this.addAttribute( 'position', positions.copyVector3sArray( geometry.vertices ) );
				this.addAttribute( 'color', colors.copyColorsArray( geometry.colors ) );

				if ( geometry.lineDistances && geometry.lineDistances.length === geometry.vertices.length ) {

					var lineDistances = new Float32BufferAttribute( geometry.lineDistances.length, 1 );

					this.addAttribute( 'lineDistance', lineDistances.copyArray( geometry.lineDistances ) );

				}

				if ( geometry.boundingSphere !== null ) {

					this.boundingSphere = geometry.boundingSphere.clone();

				}

				if ( geometry.boundingBox !== null ) {

					this.boundingBox = geometry.boundingBox.clone();

				}

			} else if ( object.isMesh ) {

				if ( geometry && geometry.isGeometry ) {

					this.fromGeometry( geometry );

				}

			}

			return this;

		},

		setFromPoints: function ( points ) {

			var position = [];

			for ( var i = 0, l = points.length; i < l; i ++ ) {

				var point = points[ i ];
				position.push( point.x, point.y, point.z || 0 );

			}

			this.addAttribute( 'position', new Float32BufferAttribute( position, 3 ) );

			return this;

		},

		updateFromObject: function ( object ) {

			var geometry = object.geometry;

			if ( object.isMesh ) {

				var direct = geometry.__directGeometry;

				if ( geometry.elementsNeedUpdate === true ) {

					direct = undefined;
					geometry.elementsNeedUpdate = false;

				}

				if ( direct === undefined ) {

					return this.fromGeometry( geometry );

				}

				direct.verticesNeedUpdate = geometry.verticesNeedUpdate;
				direct.normalsNeedUpdate = geometry.normalsNeedUpdate;
				direct.colorsNeedUpdate = geometry.colorsNeedUpdate;
				direct.uvsNeedUpdate = geometry.uvsNeedUpdate;
				direct.groupsNeedUpdate = geometry.groupsNeedUpdate;

				geometry.verticesNeedUpdate = false;
				geometry.normalsNeedUpdate = false;
				geometry.colorsNeedUpdate = false;
				geometry.uvsNeedUpdate = false;
				geometry.groupsNeedUpdate = false;

				geometry = direct;

			}

			var attribute;

			if ( geometry.verticesNeedUpdate === true ) {

				attribute = this.attributes.position;

				if ( attribute !== undefined ) {

					attribute.copyVector3sArray( geometry.vertices );
					attribute.needsUpdate = true;

				}

				geometry.verticesNeedUpdate = false;

			}

			if ( geometry.normalsNeedUpdate === true ) {

				attribute = this.attributes.normal;

				if ( attribute !== undefined ) {

					attribute.copyVector3sArray( geometry.normals );
					attribute.needsUpdate = true;

				}

				geometry.normalsNeedUpdate = false;

			}

			if ( geometry.colorsNeedUpdate === true ) {

				attribute = this.attributes.color;

				if ( attribute !== undefined ) {

					attribute.copyColorsArray( geometry.colors );
					attribute.needsUpdate = true;

				}

				geometry.colorsNeedUpdate = false;

			}

			if ( geometry.uvsNeedUpdate ) {

				attribute = this.attributes.uv;

				if ( attribute !== undefined ) {

					attribute.copyVector2sArray( geometry.uvs );
					attribute.needsUpdate = true;

				}

				geometry.uvsNeedUpdate = false;

			}

			if ( geometry.lineDistancesNeedUpdate ) {

				attribute = this.attributes.lineDistance;

				if ( attribute !== undefined ) {

					attribute.copyArray( geometry.lineDistances );
					attribute.needsUpdate = true;

				}

				geometry.lineDistancesNeedUpdate = false;

			}

			if ( geometry.groupsNeedUpdate ) {

				geometry.computeGroups( object.geometry );
				this.groups = geometry.groups;

				geometry.groupsNeedUpdate = false;

			}

			return this;

		},

		fromGeometry: function ( geometry ) {

			geometry.__directGeometry = new DirectGeometry().fromGeometry( geometry );

			return this.fromDirectGeometry( geometry.__directGeometry );

		},

		fromDirectGeometry: function ( geometry ) {

			var positions = new Float32Array( geometry.vertices.length * 3 );
			this.addAttribute( 'position', new BufferAttribute( positions, 3 ).copyVector3sArray( geometry.vertices ) );

			if ( geometry.normals.length > 0 ) {

				var normals = new Float32Array( geometry.normals.length * 3 );
				this.addAttribute( 'normal', new BufferAttribute( normals, 3 ).copyVector3sArray( geometry.normals ) );

			}

			if ( geometry.colors.length > 0 ) {

				var colors = new Float32Array( geometry.colors.length * 3 );
				this.addAttribute( 'color', new BufferAttribute( colors, 3 ).copyColorsArray( geometry.colors ) );

			}

			if ( geometry.uvs.length > 0 ) {

				var uvs = new Float32Array( geometry.uvs.length * 2 );
				this.addAttribute( 'uv', new BufferAttribute( uvs, 2 ).copyVector2sArray( geometry.uvs ) );

			}

			if ( geometry.uvs2.length > 0 ) {

				var uvs2 = new Float32Array( geometry.uvs2.length * 2 );
				this.addAttribute( 'uv2', new BufferAttribute( uvs2, 2 ).copyVector2sArray( geometry.uvs2 ) );

			}

			if ( geometry.indices.length > 0 ) {

				var TypeArray = arrayMax( geometry.indices ) > 65535 ? Uint32Array : Uint16Array;
				var indices = new TypeArray( geometry.indices.length * 3 );
				this.setIndex( new BufferAttribute( indices, 1 ).copyIndicesArray( geometry.indices ) );

			}

			// groups

			this.groups = geometry.groups;

			// morphs

			for ( var name in geometry.morphTargets ) {

				var array = [];
				var morphTargets = geometry.morphTargets[ name ];

				for ( var i = 0, l = morphTargets.length; i < l; i ++ ) {

					var morphTarget = morphTargets[ i ];

					var attribute = new Float32BufferAttribute( morphTarget.length * 3, 3 );

					array.push( attribute.copyVector3sArray( morphTarget ) );

				}

				this.morphAttributes[ name ] = array;

			}

			// skinning

			if ( geometry.skinIndices.length > 0 ) {

				var skinIndices = new Float32BufferAttribute( geometry.skinIndices.length * 4, 4 );
				this.addAttribute( 'skinIndex', skinIndices.copyVector4sArray( geometry.skinIndices ) );

			}

			if ( geometry.skinWeights.length > 0 ) {

				var skinWeights = new Float32BufferAttribute( geometry.skinWeights.length * 4, 4 );
				this.addAttribute( 'skinWeight', skinWeights.copyVector4sArray( geometry.skinWeights ) );

			}

			//

			if ( geometry.boundingSphere !== null ) {

				this.boundingSphere = geometry.boundingSphere.clone();

			}

			if ( geometry.boundingBox !== null ) {

				this.boundingBox = geometry.boundingBox.clone();

			}

			return this;

		},

		computeBoundingBox: function () {

			if ( this.boundingBox === null ) {

				this.boundingBox = new Box3();

			}

			var position = this.attributes.position;

			if ( position !== undefined ) {

				this.boundingBox.setFromBufferAttribute( position );

			} else {

				this.boundingBox.makeEmpty();

			}

			if ( isNaN( this.boundingBox.min.x ) || isNaN( this.boundingBox.min.y ) || isNaN( this.boundingBox.min.z ) ) {

				console.error( 'THREE.BufferGeometry.computeBoundingBox: Computed min/max have NaN values. The "position" attribute is likely to have NaN values.', this );

			}

		},

		computeBoundingSphere: function () {

			var box = new Box3();
			var vector = new Vector3();

			return function computeBoundingSphere() {

				if ( this.boundingSphere === null ) {

					this.boundingSphere = new Sphere();

				}

				var position = this.attributes.position;

				if ( position ) {

					var center = this.boundingSphere.center;

					box.setFromBufferAttribute( position );
					box.getCenter( center );

					// hoping to find a boundingSphere with a radius smaller than the
					// boundingSphere of the boundingBox: sqrt(3) smaller in the best case

					var maxRadiusSq = 0;

					for ( var i = 0, il = position.count; i < il; i ++ ) {

						vector.x = position.getX( i );
						vector.y = position.getY( i );
						vector.z = position.getZ( i );
						maxRadiusSq = Math.max( maxRadiusSq, center.distanceToSquared( vector ) );

					}

					this.boundingSphere.radius = Math.sqrt( maxRadiusSq );

					if ( isNaN( this.boundingSphere.radius ) ) {

						console.error( 'THREE.BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.', this );

					}

				}

			};

		}(),

		computeFaceNormals: function () {

			// backwards compatibility

		},

		computeVertexNormals: function () {

			var index = this.index;
			var attributes = this.attributes;
			var groups = this.groups;

			if ( attributes.position ) {

				var positions = attributes.position.array;

				if ( attributes.normal === undefined ) {

					this.addAttribute( 'normal', new BufferAttribute( new Float32Array( positions.length ), 3 ) );

				} else {

					// reset existing normals to zero

					var array = attributes.normal.array;

					for ( var i = 0, il = array.length; i < il; i ++ ) {

						array[ i ] = 0;

					}

				}

				var normals = attributes.normal.array;

				var vA, vB, vC;
				var pA = new Vector3(), pB = new Vector3(), pC = new Vector3();
				var cb = new Vector3(), ab = new Vector3();

				// indexed elements

				if ( index ) {

					var indices = index.array;

					if ( groups.length === 0 ) {

						this.addGroup( 0, indices.length );

					}

					for ( var j = 0, jl = groups.length; j < jl; ++ j ) {

						var group = groups[ j ];

						var start = group.start;
						var count = group.count;

						for ( var i = start, il = start + count; i < il; i += 3 ) {

							vA = indices[ i + 0 ] * 3;
							vB = indices[ i + 1 ] * 3;
							vC = indices[ i + 2 ] * 3;

							pA.fromArray( positions, vA );
							pB.fromArray( positions, vB );
							pC.fromArray( positions, vC );

							cb.subVectors( pC, pB );
							ab.subVectors( pA, pB );
							cb.cross( ab );

							normals[ vA ] += cb.x;
							normals[ vA + 1 ] += cb.y;
							normals[ vA + 2 ] += cb.z;

							normals[ vB ] += cb.x;
							normals[ vB + 1 ] += cb.y;
							normals[ vB + 2 ] += cb.z;

							normals[ vC ] += cb.x;
							normals[ vC + 1 ] += cb.y;
							normals[ vC + 2 ] += cb.z;

						}

					}

				} else {

					// non-indexed elements (unconnected triangle soup)

					for ( var i = 0, il = positions.length; i < il; i += 9 ) {

						pA.fromArray( positions, i );
						pB.fromArray( positions, i + 3 );
						pC.fromArray( positions, i + 6 );

						cb.subVectors( pC, pB );
						ab.subVectors( pA, pB );
						cb.cross( ab );

						normals[ i ] = cb.x;
						normals[ i + 1 ] = cb.y;
						normals[ i + 2 ] = cb.z;

						normals[ i + 3 ] = cb.x;
						normals[ i + 4 ] = cb.y;
						normals[ i + 5 ] = cb.z;

						normals[ i + 6 ] = cb.x;
						normals[ i + 7 ] = cb.y;
						normals[ i + 8 ] = cb.z;

					}

				}

				this.normalizeNormals();

				attributes.normal.needsUpdate = true;

			}

		},

		merge: function ( geometry, offset ) {

			if ( ! ( geometry && geometry.isBufferGeometry ) ) {

				console.error( 'THREE.BufferGeometry.merge(): geometry not an instance of THREE.BufferGeometry.', geometry );
				return;

			}

			if ( offset === undefined ) offset = 0;

			var attributes = this.attributes;

			for ( var key in attributes ) {

				if ( geometry.attributes[ key ] === undefined ) continue;

				var attribute1 = attributes[ key ];
				var attributeArray1 = attribute1.array;

				var attribute2 = geometry.attributes[ key ];
				var attributeArray2 = attribute2.array;

				var attributeSize = attribute2.itemSize;

				for ( var i = 0, j = attributeSize * offset; i < attributeArray2.length; i ++, j ++ ) {

					attributeArray1[ j ] = attributeArray2[ i ];

				}

			}

			return this;

		},

		normalizeNormals: function () {

			var vector = new Vector3();

			return function normalizeNormals() {

				var normals = this.attributes.normal;

				for ( var i = 0, il = normals.count; i < il; i ++ ) {

					vector.x = normals.getX( i );
					vector.y = normals.getY( i );
					vector.z = normals.getZ( i );

					vector.normalize();

					normals.setXYZ( i, vector.x, vector.y, vector.z );

				}

			};

		}(),

		toNonIndexed: function () {

			if ( this.index === null ) {

				console.warn( 'THREE.BufferGeometry.toNonIndexed(): Geometry is already non-indexed.' );
				return this;

			}

			var geometry2 = new BufferGeometry();

			var indices = this.index.array;
			var attributes = this.attributes;

			for ( var name in attributes ) {

				var attribute = attributes[ name ];

				var array = attribute.array;
				var itemSize = attribute.itemSize;

				var array2 = new array.constructor( indices.length * itemSize );

				var index = 0, index2 = 0;

				for ( var i = 0, l = indices.length; i < l; i ++ ) {

					index = indices[ i ] * itemSize;

					for ( var j = 0; j < itemSize; j ++ ) {

						array2[ index2 ++ ] = array[ index ++ ];

					}

				}

				geometry2.addAttribute( name, new BufferAttribute( array2, itemSize ) );

			}

			return geometry2;

		},

		toJSON: function () {

			var data = {
				metadata: {
					version: 4.5,
					type: 'BufferGeometry',
					generator: 'BufferGeometry.toJSON'
				}
			};

			// standard BufferGeometry serialization

			data.uuid = this.uuid;
			data.type = this.type;
			if ( this.name !== '' ) data.name = this.name;

			if ( this.parameters !== undefined ) {

				var parameters = this.parameters;

				for ( var key in parameters ) {

					if ( parameters[ key ] !== undefined ) data[ key ] = parameters[ key ];

				}

				return data;

			}

			data.data = { attributes: {} };

			var index = this.index;

			if ( index !== null ) {

				var array = Array.prototype.slice.call( index.array );

				data.data.index = {
					type: index.array.constructor.name,
					array: array
				};

			}

			var attributes = this.attributes;

			for ( var key in attributes ) {

				var attribute = attributes[ key ];

				var array = Array.prototype.slice.call( attribute.array );

				data.data.attributes[ key ] = {
					itemSize: attribute.itemSize,
					type: attribute.array.constructor.name,
					array: array,
					normalized: attribute.normalized
				};

			}

			var groups = this.groups;

			if ( groups.length > 0 ) {

				data.data.groups = JSON.parse( JSON.stringify( groups ) );

			}

			var boundingSphere = this.boundingSphere;

			if ( boundingSphere !== null ) {

				data.data.boundingSphere = {
					center: boundingSphere.center.toArray(),
					radius: boundingSphere.radius
				};

			}

			return data;

		},

		clone: function () {

			/*
			 // Handle primitives

			 var parameters = this.parameters;

			 if ( parameters !== undefined ) {

			 var values = [];

			 for ( var key in parameters ) {

			 values.push( parameters[ key ] );

			 }

			 var geometry = Object.create( this.constructor.prototype );
			 this.constructor.apply( geometry, values );
			 return geometry;

			 }

			 return new this.constructor().copy( this );
			 */

			return new BufferGeometry().copy( this );

		},

		copy: function ( source ) {

			var name, i, l;

			// reset

			this.index = null;
			this.attributes = {};
			this.morphAttributes = {};
			this.groups = [];
			this.boundingBox = null;
			this.boundingSphere = null;

			// name

			this.name = source.name;

			// index

			var index = source.index;

			if ( index !== null ) {

				this.setIndex( index.clone() );

			}

			// attributes

			var attributes = source.attributes;

			for ( name in attributes ) {

				var attribute = attributes[ name ];
				this.addAttribute( name, attribute.clone() );

			}

			// morph attributes

			var morphAttributes = source.morphAttributes;

			for ( name in morphAttributes ) {

				var array = [];
				var morphAttribute = morphAttributes[ name ]; // morphAttribute: array of Float32BufferAttributes

				for ( i = 0, l = morphAttribute.length; i < l; i ++ ) {

					array.push( morphAttribute[ i ].clone() );

				}

				this.morphAttributes[ name ] = array;

			}

			// groups

			var groups = source.groups;

			for ( i = 0, l = groups.length; i < l; i ++ ) {

				var group = groups[ i ];
				this.addGroup( group.start, group.count, group.materialIndex );

			}

			// bounding box

			var boundingBox = source.boundingBox;

			if ( boundingBox !== null ) {

				this.boundingBox = boundingBox.clone();

			}

			// bounding sphere

			var boundingSphere = source.boundingSphere;

			if ( boundingSphere !== null ) {

				this.boundingSphere = boundingSphere.clone();

			}

			// draw range

			this.drawRange.start = source.drawRange.start;
			this.drawRange.count = source.drawRange.count;

			return this;

		},

		dispose: function () {

			this.dispatchEvent( { type: 'dispose' } );

		}

	} );

	/**
	 * @author bhouston / http://clara.io
	 */

	function Line3( start, end ) {

		this.start = ( start !== undefined ) ? start : new Vector3();
		this.end = ( end !== undefined ) ? end : new Vector3();

	}

	Object.assign( Line3.prototype, {

		set: function ( start, end ) {

			this.start.copy( start );
			this.end.copy( end );

			return this;

		},

		clone: function () {

			return new this.constructor().copy( this );

		},

		copy: function ( line ) {

			this.start.copy( line.start );
			this.end.copy( line.end );

			return this;

		},

		getCenter: function ( optionalTarget ) {

			var result = optionalTarget || new Vector3();
			return result.addVectors( this.start, this.end ).multiplyScalar( 0.5 );

		},

		delta: function ( optionalTarget ) {

			var result = optionalTarget || new Vector3();
			return result.subVectors( this.end, this.start );

		},

		distanceSq: function () {

			return this.start.distanceToSquared( this.end );

		},

		distance: function () {

			return this.start.distanceTo( this.end );

		},

		at: function ( t, optionalTarget ) {

			var result = optionalTarget || new Vector3();

			return this.delta( result ).multiplyScalar( t ).add( this.start );

		},

		closestPointToPointParameter: function () {

			var startP = new Vector3();
			var startEnd = new Vector3();

			return function closestPointToPointParameter( point, clampToLine ) {

				startP.subVectors( point, this.start );
				startEnd.subVectors( this.end, this.start );

				var startEnd2 = startEnd.dot( startEnd );
				var startEnd_startP = startEnd.dot( startP );

				var t = startEnd_startP / startEnd2;

				if ( clampToLine ) {

					t = _Math.clamp( t, 0, 1 );

				}

				return t;

			};

		}(),

		closestPointToPoint: function ( point, clampToLine, optionalTarget ) {

			var t = this.closestPointToPointParameter( point, clampToLine );

			var result = optionalTarget || new Vector3();

			return this.delta( result ).multiplyScalar( t ).add( this.start );

		},

		applyMatrix4: function ( matrix ) {

			this.start.applyMatrix4( matrix );
			this.end.applyMatrix4( matrix );

			return this;

		},

		equals: function ( line ) {

			return line.start.equals( this.start ) && line.end.equals( this.end );

		}

	} );

	/**
	 * @author bhouston / http://clara.io
	 */

	function Plane( normal, constant ) {

		// normal is assumed to be normalized

		this.normal = ( normal !== undefined ) ? normal : new Vector3( 1, 0, 0 );
		this.constant = ( constant !== undefined ) ? constant : 0;

	}

	Object.assign( Plane.prototype, {

		set: function ( normal, constant ) {

			this.normal.copy( normal );
			this.constant = constant;

			return this;

		},

		setComponents: function ( x, y, z, w ) {

			this.normal.set( x, y, z );
			this.constant = w;

			return this;

		},

		setFromNormalAndCoplanarPoint: function ( normal, point ) {

			this.normal.copy( normal );
			this.constant = - point.dot( this.normal );

			return this;

		},

		setFromCoplanarPoints: function () {

			var v1 = new Vector3();
			var v2 = new Vector3();

			return function setFromCoplanarPoints( a, b, c ) {

				var normal = v1.subVectors( c, b ).cross( v2.subVectors( a, b ) ).normalize();

				// Q: should an error be thrown if normal is zero (e.g. degenerate plane)?

				this.setFromNormalAndCoplanarPoint( normal, a );

				return this;

			};

		}(),

		clone: function () {

			return new this.constructor().copy( this );

		},

		copy: function ( plane ) {

			this.normal.copy( plane.normal );
			this.constant = plane.constant;

			return this;

		},

		normalize: function () {

			// Note: will lead to a divide by zero if the plane is invalid.

			var inverseNormalLength = 1.0 / this.normal.length();
			this.normal.multiplyScalar( inverseNormalLength );
			this.constant *= inverseNormalLength;

			return this;

		},

		negate: function () {

			this.constant *= - 1;
			this.normal.negate();

			return this;

		},

		distanceToPoint: function ( point ) {

			return this.normal.dot( point ) + this.constant;

		},

		distanceToSphere: function ( sphere ) {

			return this.distanceToPoint( sphere.center ) - sphere.radius;

		},

		projectPoint: function ( point, optionalTarget ) {

			var result = optionalTarget || new Vector3();

			return result.copy( this.normal ).multiplyScalar( - this.distanceToPoint( point ) ).add( point );

		},

		intersectLine: function () {

			var v1 = new Vector3();

			return function intersectLine( line, optionalTarget ) {

				var result = optionalTarget || new Vector3();

				var direction = line.delta( v1 );

				var denominator = this.normal.dot( direction );

				if ( denominator === 0 ) {

					// line is coplanar, return origin
					if ( this.distanceToPoint( line.start ) === 0 ) {

						return result.copy( line.start );

					}

					// Unsure if this is the correct method to handle this case.
					return undefined;

				}

				var t = - ( line.start.dot( this.normal ) + this.constant ) / denominator;

				if ( t < 0 || t > 1 ) {

					return undefined;

				}

				return result.copy( direction ).multiplyScalar( t ).add( line.start );

			};

		}(),

		intersectsLine: function ( line ) {

			// Note: this tests if a line intersects the plane, not whether it (or its end-points) are coplanar with it.

			var startSign = this.distanceToPoint( line.start );
			var endSign = this.distanceToPoint( line.end );

			return ( startSign < 0 && endSign > 0 ) || ( endSign < 0 && startSign > 0 );

		},

		intersectsBox: function ( box ) {

			return box.intersectsPlane( this );

		},

		intersectsSphere: function ( sphere ) {

			return sphere.intersectsPlane( this );

		},

		coplanarPoint: function ( optionalTarget ) {

			var result = optionalTarget || new Vector3();

			return result.copy( this.normal ).multiplyScalar( - this.constant );

		},

		applyMatrix4: function () {

			var v1 = new Vector3();
			var m1 = new Matrix3();

			return function applyMatrix4( matrix, optionalNormalMatrix ) {

				var normalMatrix = optionalNormalMatrix || m1.getNormalMatrix( matrix );

				var referencePoint = this.coplanarPoint( v1 ).applyMatrix4( matrix );

				var normal = this.normal.applyMatrix3( normalMatrix ).normalize();

				this.constant = - referencePoint.dot( normal );

				return this;

			};

		}(),

		translate: function ( offset ) {

			this.constant -= offset.dot( this.normal );

			return this;

		},

		equals: function ( plane ) {

			return plane.normal.equals( this.normal ) && ( plane.constant === this.constant );

		}

	} );

	/**
	 * @author bhouston / http://clara.io
	 * @author mrdoob / http://mrdoob.com/
	 */

	function Triangle( a, b, c ) {

		this.a = ( a !== undefined ) ? a : new Vector3();
		this.b = ( b !== undefined ) ? b : new Vector3();
		this.c = ( c !== undefined ) ? c : new Vector3();

	}

	Object.assign( Triangle, {

		normal: function () {

			var v0 = new Vector3();

			return function normal( a, b, c, optionalTarget ) {

				var result = optionalTarget || new Vector3();

				result.subVectors( c, b );
				v0.subVectors( a, b );
				result.cross( v0 );

				var resultLengthSq = result.lengthSq();
				if ( resultLengthSq > 0 ) {

					return result.multiplyScalar( 1 / Math.sqrt( resultLengthSq ) );

				}

				return result.set( 0, 0, 0 );

			};

		}(),

		// static/instance method to calculate barycentric coordinates
		// based on: http://www.blackpawn.com/texts/pointinpoly/default.html
		barycoordFromPoint: function () {

			var v0 = new Vector3();
			var v1 = new Vector3();
			var v2 = new Vector3();

			return function barycoordFromPoint( point, a, b, c, optionalTarget ) {

				v0.subVectors( c, a );
				v1.subVectors( b, a );
				v2.subVectors( point, a );

				var dot00 = v0.dot( v0 );
				var dot01 = v0.dot( v1 );
				var dot02 = v0.dot( v2 );
				var dot11 = v1.dot( v1 );
				var dot12 = v1.dot( v2 );

				var denom = ( dot00 * dot11 - dot01 * dot01 );

				var result = optionalTarget || new Vector3();

				// collinear or singular triangle
				if ( denom === 0 ) {

					// arbitrary location outside of triangle?
					// not sure if this is the best idea, maybe should be returning undefined
					return result.set( - 2, - 1, - 1 );

				}

				var invDenom = 1 / denom;
				var u = ( dot11 * dot02 - dot01 * dot12 ) * invDenom;
				var v = ( dot00 * dot12 - dot01 * dot02 ) * invDenom;

				// barycentric coordinates must always sum to 1
				return result.set( 1 - u - v, v, u );

			};

		}(),

		containsPoint: function () {

			var v1 = new Vector3();

			return function containsPoint( point, a, b, c ) {

				var result = Triangle.barycoordFromPoint( point, a, b, c, v1 );

				return ( result.x >= 0 ) && ( result.y >= 0 ) && ( ( result.x + result.y ) <= 1 );

			};

		}()

	} );

	Object.assign( Triangle.prototype, {

		set: function ( a, b, c ) {

			this.a.copy( a );
			this.b.copy( b );
			this.c.copy( c );

			return this;

		},

		setFromPointsAndIndices: function ( points, i0, i1, i2 ) {

			this.a.copy( points[ i0 ] );
			this.b.copy( points[ i1 ] );
			this.c.copy( points[ i2 ] );

			return this;

		},

		clone: function () {

			return new this.constructor().copy( this );

		},

		copy: function ( triangle ) {

			this.a.copy( triangle.a );
			this.b.copy( triangle.b );
			this.c.copy( triangle.c );

			return this;

		},

		area: function () {

			var v0 = new Vector3();
			var v1 = new Vector3();

			return function area() {

				v0.subVectors( this.c, this.b );
				v1.subVectors( this.a, this.b );

				return v0.cross( v1 ).length() * 0.5;

			};

		}(),

		midpoint: function ( optionalTarget ) {

			var result = optionalTarget || new Vector3();
			return result.addVectors( this.a, this.b ).add( this.c ).multiplyScalar( 1 / 3 );

		},

		normal: function ( optionalTarget ) {

			return Triangle.normal( this.a, this.b, this.c, optionalTarget );

		},

		plane: function ( optionalTarget ) {

			var result = optionalTarget || new Plane();

			return result.setFromCoplanarPoints( this.a, this.b, this.c );

		},

		barycoordFromPoint: function ( point, optionalTarget ) {

			return Triangle.barycoordFromPoint( point, this.a, this.b, this.c, optionalTarget );

		},

		containsPoint: function ( point ) {

			return Triangle.containsPoint( point, this.a, this.b, this.c );

		},

		closestPointToPoint: function () {

			var plane = new Plane();
			var edgeList = [ new Line3(), new Line3(), new Line3() ];
			var projectedPoint = new Vector3();
			var closestPoint = new Vector3();

			return function closestPointToPoint( point, optionalTarget ) {

				var result = optionalTarget || new Vector3();
				var minDistance = Infinity;

				// project the point onto the plane of the triangle

				plane.setFromCoplanarPoints( this.a, this.b, this.c );
				plane.projectPoint( point, projectedPoint );

				// check if the projection lies within the triangle

				if ( this.containsPoint( projectedPoint ) === true ) {

					// if so, this is the closest point

					result.copy( projectedPoint );

				} else {

					// if not, the point falls outside the triangle. the result is the closest point to the triangle's edges or vertices

					edgeList[ 0 ].set( this.a, this.b );
					edgeList[ 1 ].set( this.b, this.c );
					edgeList[ 2 ].set( this.c, this.a );

					for ( var i = 0; i < edgeList.length; i ++ ) {

						edgeList[ i ].closestPointToPoint( projectedPoint, true, closestPoint );

						var distance = projectedPoint.distanceToSquared( closestPoint );

						if ( distance < minDistance ) {

							minDistance = distance;

							result.copy( closestPoint );

						}

					}

				}

				return result;

			};

		}(),

		equals: function ( triangle ) {

			return triangle.a.equals( this.a ) && triangle.b.equals( this.b ) && triangle.c.equals( this.c );

		}

	} );

	/**
	 * @author Mugen87 / https://github.com/Mugen87
	 *
	 * Ported from: https://github.com/maurizzzio/quickhull3d/ by Mauricio Poppe (https://github.com/maurizzzio)
	 *
	 */



		var Visible = 0;
		var Deleted = 1;

		function QuickHull() {

			this.tolerance = - 1;

			this.faces = []; // the generated faces of the convex hull
			this.newFaces = []; // this array holds the faces that are generated within a single iteration

			// the vertex lists work as follows:
			//
			// let 'a' and 'b' be 'Face' instances
			// let 'v' be points wrapped as instance of 'Vertex'
			//
			//     [v, v, ..., v, v, v, ...]
			//      ^             ^
			//      |             |
			//  a.outside     b.outside
			//
			this.assigned = new VertexList();
			this.unassigned = new VertexList();

			this.vertices = []; 	// vertices of the hull (internal representation of given geometry data)

		}

		Object.assign( QuickHull.prototype, {

			setFromPoints: function ( points ) {

				if ( Array.isArray( points ) !== true ) {

					console.error( 'QuickHull: Points parameter is not an array.' );

				}

				if ( points.length < 4 ) {

					console.error( 'QuickHull: The algorithm needs at least four points.' );

				}

				this.makeEmpty();

				for ( var i = 0, l = points.length; i < l; i ++ ) {

					this.vertices.push( new VertexNode( points[ i ] ) );

				}

				this.compute();

				return this;

			},

			setFromObject: function ( object ) {

				var points = [];

				object.updateMatrixWorld( true );

				object.traverse( function ( node ) {

					var i, l, point;

					var geometry = node.geometry;

					if ( geometry !== undefined ) {

						if ( geometry.isGeometry ) {

							var vertices = geometry.vertices;

							for ( i = 0, l = vertices.length; i < l; i ++ ) {

								point = vertices[ i ].clone();
								point.applyMatrix4( node.matrixWorld );

								points.push( point );

							}

						} else if ( geometry.isBufferGeometry ) {

							var attribute = geometry.attributes.position;

							if ( attribute !== undefined ) {

								for ( i = 0, l = attribute.count; i < l; i ++ ) {

									point = new Vector3();

									point.fromBufferAttribute( attribute, i ).applyMatrix4( node.matrixWorld );

									points.push( point );

								}

							}

						}

					}

				} );

				return this.setFromPoints( points );

			},

			makeEmpty: function () {

				this.faces = [];
				this.vertices = [];

				return this;

			},

			// Adds a vertex to the 'assigned' list of vertices and assigns it to the given face

			addVertexToFace: function ( vertex, face ) {

				vertex.face = face;

				if ( face.outside === null ) {

					this.assigned.append( vertex );

				} else {

					this.assigned.insertBefore( face.outside, vertex );

				}

				face.outside = vertex;

				return this;

			},

			// Removes a vertex from the 'assigned' list of vertices and from the given face

			removeVertexFromFace: function ( vertex, face ) {

				if ( vertex === face.outside ) {

					// fix face.outside link

					if ( vertex.next !== null && vertex.next.face === face ) {

						// face has at least 2 outside vertices, move the 'outside' reference

						face.outside = vertex.next;

					} else {

						// vertex was the only outside vertex that face had

						face.outside = null;

					}

				}

				this.assigned.remove( vertex );

				return this;

			},

			// Removes all the visible vertices that a given face is able to see which are stored in the 'assigned' vertext list

			removeAllVerticesFromFace: function ( face ) {

				if ( face.outside !== null ) {

					// reference to the first and last vertex of this face

					var start = face.outside;
					var end = face.outside;

					while ( end.next !== null && end.next.face === face ) {

						end = end.next;

					}

					this.assigned.removeSubList( start, end );

					// fix references

					start.prev = end.next = null;
					face.outside = null;

					return start;

				}

			},

			// Removes all the visible vertices that 'face' is able to see

			deleteFaceVertices: function ( face, absorbingFace ) {

				var faceVertices = this.removeAllVerticesFromFace( face );

				if ( faceVertices !== undefined ) {

					if ( absorbingFace === undefined ) {

						// mark the vertices to be reassigned to some other face

						this.unassigned.appendChain( faceVertices );


					} else {

						// if there's an absorbing face try to assign as many vertices as possible to it

						var vertex = faceVertices;

						do {

							// we need to buffer the subsequent vertex at this point because the 'vertex.next' reference
							// will be changed by upcoming method calls

							var nextVertex = vertex.next;

							var distance = absorbingFace.distanceToPoint( vertex.point );

							// check if 'vertex' is able to see 'absorbingFace'

							if ( distance > this.tolerance ) {

								this.addVertexToFace( vertex, absorbingFace );

							} else {

								this.unassigned.append( vertex );

							}

							// now assign next vertex

							vertex = nextVertex;

						} while ( vertex !== null );

					}

				}

				return this;

			},

			// Reassigns as many vertices as possible from the unassigned list to the new faces

			resolveUnassignedPoints: function ( newFaces ) {

				if ( this.unassigned.isEmpty() === false ) {

					var vertex = this.unassigned.first();

					do {

						// buffer 'next' reference, see .deleteFaceVertices()

						var nextVertex = vertex.next;

						var maxDistance = this.tolerance;

						var maxFace = null;

						for ( var i = 0; i < newFaces.length; i ++ ) {

							var face = newFaces[ i ];

							if ( face.mark === Visible ) {

								var distance = face.distanceToPoint( vertex.point );

								if ( distance > maxDistance ) {

									maxDistance = distance;
									maxFace = face;

								}

								if ( maxDistance > 1000 * this.tolerance ) break;

							}

						}

						// 'maxFace' can be null e.g. if there are identical vertices

						if ( maxFace !== null ) {

							this.addVertexToFace( vertex, maxFace );

						}

						vertex = nextVertex;

					} while ( vertex !== null );

				}

				return this;

			},

			// Computes the extremes of a simplex which will be the initial hull

			computeExtremes: function () {

				var min = new Vector3();
				var max = new Vector3();

				var minVertices = [];
				var maxVertices = [];

				var i, l, j;

				// initially assume that the first vertex is the min/max

				for ( i = 0; i < 3; i ++ ) {

					minVertices[ i ] = maxVertices[ i ] = this.vertices[ 0 ];

				}

				min.copy( this.vertices[ 0 ].point );
				max.copy( this.vertices[ 0 ].point );

				// compute the min/max vertex on all six directions

				for ( i = 0, l = this.vertices.length; i < l; i ++ ) {

					var vertex = this.vertices[ i ];
					var point = vertex.point;

					// update the min coordinates

					for ( j = 0; j < 3; j ++ ) {

						if ( point.getComponent( j ) < min.getComponent( j ) ) {

							min.setComponent( j, point.getComponent( j ) );
							minVertices[ j ] = vertex;

						}

					}

					// update the max coordinates

					for ( j = 0; j < 3; j ++ ) {

						if ( point.getComponent( j ) > max.getComponent( j ) ) {

							max.setComponent( j, point.getComponent( j ) );
							maxVertices[ j ] = vertex;

						}

					}

				}

				// use min/max vectors to compute an optimal epsilon

				this.tolerance = 3 * Number.EPSILON * (
					Math.max( Math.abs( min.x ), Math.abs( max.x ) ) +
					Math.max( Math.abs( min.y ), Math.abs( max.y ) ) +
					Math.max( Math.abs( min.z ), Math.abs( max.z ) )
				);

				return { min: minVertices, max: maxVertices };

			},

			// Computes the initial simplex assigning to its faces all the points
			// that are candidates to form part of the hull

			computeInitialHull: function () {

				var line3, plane, closestPoint;

				return function computeInitialHull() {

					if ( line3 === undefined ) {

						line3 = new Line3();
						plane = new Plane();
						closestPoint = new Vector3();

					}

					var vertex, vertices = this.vertices;
					var extremes = this.computeExtremes();
					var min = extremes.min;
					var max = extremes.max;

					var v0, v1, v2, v3;
					var i, l, j;

					// 1. Find the two vertices 'v0' and 'v1' with the greatest 1d separation
					// (max.x - min.x)
					// (max.y - min.y)
					// (max.z - min.z)

					var distance, maxDistance = 0;
					var index = 0;

					for ( i = 0; i < 3; i ++ ) {

						distance = max[ i ].point.getComponent( i ) - min[ i ].point.getComponent( i );

						if ( distance > maxDistance ) {

							maxDistance = distance;
							index = i;

						}

					}

					v0 = min[ index ];
					v1 = max[ index ];

					// 2. The next vertex 'v2' is the one farthest to the line formed by 'v0' and 'v1'

					maxDistance = 0;
					line3.set( v0.point, v1.point );

					for ( i = 0, l = this.vertices.length; i < l; i ++ ) {

						vertex = vertices[ i ];

						if ( vertex !== v0 && vertex !== v1 ) {

							line3.closestPointToPoint( vertex.point, true, closestPoint );

							distance = closestPoint.distanceToSquared( vertex.point );

							if ( distance > maxDistance ) {

								maxDistance = distance;
								v2 = vertex;

							}

						}

					}

					// 3. The next vertex 'v3' is the one farthest to the plane 'v0', 'v1', 'v2'

					maxDistance = -1;
					plane.setFromCoplanarPoints( v0.point, v1.point, v2.point );

					for ( i = 0, l = this.vertices.length; i < l; i ++ ) {

						vertex = vertices[ i ];

						if ( vertex !== v0 && vertex !== v1 && vertex !== v2 ) {

							distance = Math.abs( plane.distanceToPoint( vertex.point ) );

							if ( distance > maxDistance ) {

								maxDistance = distance;
								v3 = vertex;

							}

						}

					}

					var faces = [];

					if ( plane.distanceToPoint( v3.point ) < 0 ) {

						// the face is not able to see the point so 'plane.normal' is pointing outside the tetrahedron

						faces.push(
							Face.create( v0, v1, v2 ),
							Face.create( v3, v1, v0 ),
							Face.create( v3, v2, v1 ),
							Face.create( v3, v0, v2 )
						);

						// set the twin edge

						for ( i = 0; i < 3; i ++ ) {

							j = ( i + 1 ) % 3;

							// join face[ i ] i > 0, with the first face

							faces[ i + 1 ].getEdge( 2 ).setTwin( faces[ 0 ].getEdge( j ) );

							// join face[ i ] with face[ i + 1 ], 1 <= i <= 3

							faces[ i + 1 ].getEdge( 1 ).setTwin( faces[ j + 1 ].getEdge( 0 ) );

						}

					} else {

						// the face is able to see the point so 'plane.normal' is pointing inside the tetrahedron

						faces.push(
							Face.create( v0, v2, v1 ),
							Face.create( v3, v0, v1 ),
							Face.create( v3, v1, v2 ),
							Face.create( v3, v2, v0 )
						);

						// set the twin edge

						for ( i = 0; i < 3; i ++ ) {

							j = ( i + 1 ) % 3;

							// join face[ i ] i > 0, with the first face

							faces[ i + 1 ].getEdge( 2 ).setTwin( faces[ 0 ].getEdge( ( 3 - i ) % 3 ) );

							// join face[ i ] with face[ i + 1 ]

							faces[ i + 1 ].getEdge( 0 ).setTwin( faces[ j + 1 ].getEdge( 1 ) );

						}

					}

					// the initial hull is the tetrahedron

					for ( i = 0; i < 4; i ++ ) {

						this.faces.push( faces[ i ] );

					}

					// initial assignment of vertices to the faces of the tetrahedron

					for ( i = 0, l = vertices.length; i < l; i ++ ) {

						vertex = vertices[ i ];

						if ( vertex !== v0 && vertex !== v1 && vertex !== v2 && vertex !== v3 ) {

							maxDistance = this.tolerance;
							var maxFace = null;

							for ( j = 0; j < 4; j ++ ) {

								distance = this.faces[ j ].distanceToPoint( vertex.point );

								if ( distance > maxDistance ) {

									maxDistance = distance;
									maxFace = this.faces[ j ];

								}

							}

							if ( maxFace !== null ) {

		          	this.addVertexToFace( vertex, maxFace );

		        	}

						}

					}

					return this;

				};

			}(),

			// Removes inactive faces

			reindexFaces: function () {

				var activeFaces = [];

				for ( var i = 0; i < this.faces.length; i ++ ) {

					var face = this.faces[ i ];

					if ( face.mark === Visible ) {

						activeFaces.push( face );

					}

				}

				this.faces = activeFaces;

				return this;

			},

			// Finds the next vertex to create faces with the current hull

			nextVertexToAdd: function () {

				// if the 'assigned' list of vertices is empty, no vertices are left. return with 'undefined'

				if ( this.assigned.isEmpty() === false ) {

					var eyeVertex, maxDistance = 0;

					// grap the first available face and start with the first visible vertex of that face

					var eyeFace = this.assigned.first().face;
					var vertex = eyeFace.outside;

					// now calculate the farthest vertex that face can see

					do {

						var distance = eyeFace.distanceToPoint( vertex.point );

						if ( distance > maxDistance ) {

							maxDistance = distance;
							eyeVertex = vertex;

						}

						vertex = vertex.next;

					} while ( vertex !== null && vertex.face === eyeFace );

					return eyeVertex;

				}

			},

			// Computes a chain of half edges in CCW order called the 'horizon'.
			// For an edge to be part of the horizon it must join a face that can see
			// 'eyePoint' and a face that cannot see 'eyePoint'.

			computeHorizon: function ( eyePoint, crossEdge, face, horizon ) {

				// moves face's vertices to the 'unassigned' vertex list

				this.deleteFaceVertices( face );

				face.mark = Deleted;

				var edge;

				if ( crossEdge === null ) {

					edge = crossEdge = face.getEdge( 0 );

				} else {

					// start from the next edge since 'crossEdge' was already analyzed
					// (actually 'crossEdge.twin' was the edge who called this method recursively)

					edge = crossEdge.next;

				}

				do {

					var twinEdge = edge.twin;
					var oppositeFace = twinEdge.face;

					if ( oppositeFace.mark === Visible ) {

						if ( oppositeFace.distanceToPoint( eyePoint ) > this.tolerance ) {

							// the opposite face can see the vertex, so proceed with next edge

							this.computeHorizon( eyePoint, twinEdge, oppositeFace, horizon );

						} else {

							// the opposite face can't see the vertex, so this edge is part of the horizon

							horizon.push( edge );

						}

					}

					edge = edge.next;

				} while ( edge !== crossEdge );

				return this;

			},

			// Creates a face with the vertices 'eyeVertex.point', 'horizonEdge.tail' and 'horizonEdge.head' in CCW order

			addAdjoiningFace: function ( eyeVertex, horizonEdge ) {

				// all the half edges are created in ccw order thus the face is always pointing outside the hull

				var face = Face.create( eyeVertex, horizonEdge.tail(), horizonEdge.head() );

				this.faces.push( face );

				// join face.getEdge( - 1 ) with the horizon's opposite edge face.getEdge( - 1 ) = face.getEdge( 2 )

				face.getEdge( - 1 ).setTwin( horizonEdge.twin );

				return face.getEdge( 0 ); // the half edge whose vertex is the eyeVertex


			},

			//  Adds 'horizon.length' faces to the hull, each face will be linked with the
			//  horizon opposite face and the face on the left/right

			addNewFaces: function ( eyeVertex, horizon ) {

				this.newFaces = [];

				var firstSideEdge = null;
				var previousSideEdge = null;

				for ( var i = 0; i < horizon.length; i ++ ) {

					var horizonEdge = horizon[ i ];

					// returns the right side edge

					var sideEdge = this.addAdjoiningFace( eyeVertex, horizonEdge );

					if ( firstSideEdge === null ) {

						firstSideEdge = sideEdge;

					} else {

						// joins face.getEdge( 1 ) with previousFace.getEdge( 0 )

						sideEdge.next.setTwin( previousSideEdge );

					}

					this.newFaces.push( sideEdge.face );
					previousSideEdge = sideEdge;

				}

				// perform final join of new faces

				firstSideEdge.next.setTwin( previousSideEdge );

				return this;

			},

			// Adds a vertex to the hull

			addVertexToHull: function ( eyeVertex ) {

				var horizon = [];

				this.unassigned.clear();

				// remove 'eyeVertex' from 'eyeVertex.face' so that it can't be added to the 'unassigned' vertex list

				this.removeVertexFromFace( eyeVertex, eyeVertex.face );

				this.computeHorizon( eyeVertex.point, null, eyeVertex.face, horizon );

				this.addNewFaces( eyeVertex, horizon );

				// reassign 'unassigned' vertices to the new faces

				this.resolveUnassignedPoints( this.newFaces );

				return	this;

			},

			cleanup: function () {

				this.assigned.clear();
				this.unassigned.clear();
				this.newFaces = [];

				return this;

			},

			compute: function () {

				var vertex;

				this.computeInitialHull();

				// add all available vertices gradually to the hull

				while ( ( vertex = this.nextVertexToAdd() ) !== undefined ) {

					this.addVertexToHull( vertex );

				}

				this.reindexFaces();

				this.cleanup();

				return this;

			}

		} );

		//

		function Face() {

			this.normal = new Vector3();
			this.midpoint = new Vector3();
			this.area = 0;

			this.constant = 0; // signed distance from face to the origin
			this.outside = null; // reference to a vertex in a vertex list this face can see
			this.mark = Visible;
			this.edge = null;

		}

		Object.assign( Face, {

			create: function ( a, b, c ) {

				var face = new Face();

				var e0 = new HalfEdge( a, face );
				var e1 = new HalfEdge( b, face );
				var e2 = new HalfEdge( c, face );

				// join edges

				e0.next = e2.prev = e1;
				e1.next = e0.prev = e2;
				e2.next = e1.prev = e0;

				// main half edge reference

				face.edge = e0;

				return face.compute();

			}

		} );

		Object.assign( Face.prototype, {

			getEdge: function ( i ) {

				var edge = this.edge;

				while ( i > 0 ) {

					edge = edge.next;
					i --;

				}

				while ( i < 0 ) {

					edge = edge.prev;
					i ++;

				}

				return edge;

			},

			compute: function () {

				var triangle;

				return function compute() {

					if ( triangle === undefined ) triangle = new Triangle();

					var a = this.edge.tail();
					var b = this.edge.head();
					var c = this.edge.next.head();

					triangle.set( a.point, b.point, c.point );

					triangle.normal( this.normal );
					triangle.midpoint( this.midpoint );
					this.area = triangle.area();

					this.constant = this.normal.dot( this.midpoint );

					return this;

				};

			}(),

			distanceToPoint: function ( point ) {

				return this.normal.dot( point ) - this.constant;

			}

		} );

		// Entity for a Doubly-Connected Edge List (DCEL).

		function HalfEdge( vertex, face ) {

			this.vertex = vertex;
			this.prev = null;
			this.next = null;
			this.twin = null;
			this.face = face;

		}

		Object.assign( HalfEdge.prototype, {

			head: function () {

				return this.vertex;

			},

			tail: function () {

				return this.prev ? this.prev.vertex : null;

			},

			length: function () {

				var head = this.head();
				var tail = this.tail();

				if ( tail !== null ) {

					return tail.point.distanceTo( head.point );

				}

				return - 1;

			},

			lengthSquared: function () {

				var head = this.head();
				var tail = this.tail();

				if ( tail !== null ) {

					return tail.point.distanceToSquared( head.point );

				}

				return - 1;

			},

			setTwin: function ( edge ) {

				this.twin = edge;
				edge.twin = this;

				return this;

			}

		} );

		// A vertex as a double linked list node.

		function VertexNode( point ) {

			this.point = point;
			this.prev = null;
			this.next = null;
			this.face = null; // the face that is able to see this vertex

		}

		// A double linked list that contains vertex nodes.

		function VertexList() {

			this.head = null;
			this.tail = null;

		}

		Object.assign( VertexList.prototype, {

			first: function () {

				return this.head;

			},

			last: function () {

				return this.tail;

			},

			clear: function () {

				this.head = this.tail = null;

				return this;

			},

			// Inserts a vertex before the target vertex

			insertBefore: function ( target, vertex ) {

				vertex.prev = target.prev;
				vertex.next = target;

				if ( vertex.prev === null ) {

					this.head = vertex;

				} else {

					vertex.prev.next = vertex;

				}

				target.prev = vertex;

				return this;

			},

			// Inserts a vertex after the target vertex

			insertAfter: function ( target, vertex ) {

				vertex.prev = target;
				vertex.next = target.next;

				if ( vertex.next === null ) {

					this.tail = vertex;

				} else {

					vertex.next.prev = vertex;

				}

				target.next = vertex;

				return this;

			},

			// Appends a vertex to the end of the linked list

			append: function ( vertex ) {

				if ( this.head === null ) {

					this.head = vertex;

				} else {

					this.tail.next = vertex;

				}

				vertex.prev = this.tail;
				vertex.next = null; // the tail has no subsequent vertex

				this.tail = vertex;

				return this;

			},

			// Appends a chain of vertices where 'vertex' is the head.

			appendChain: function ( vertex ) {

				if ( this.head === null ) {

					this.head = vertex;

				} else {

					this.tail.next = vertex;

				}

				vertex.prev = this.tail;

				// ensure that the 'tail' reference points to the last vertex of the chain

				while ( vertex.next !== null ) {

					vertex = vertex.next;

				}

				this.tail = vertex;

				return this;

			},

			// Removes a vertex from the linked list

			remove: function ( vertex ) {

				if ( vertex.prev === null ) {

					this.head = vertex.next;

				} else {

					vertex.prev.next = vertex.next;

				}

				if ( vertex.next === null ) {

					this.tail = vertex.prev;

				} else {

					vertex.next.prev = vertex.prev;

				}

				return this;

			},

			// Removes a list of vertices whose 'head' is 'a' and whose 'tail' is b

			removeSubList: function ( a, b ) {

				if ( a.prev === null ) {

					this.head = b.next;

				} else {

					a.prev.next = b.next;

				}

				if ( b.next === null ) {

					this.tail = a.prev;

				} else {

					b.next.prev = a.prev;

				}

				return this;

			},

			isEmpty: function () {

				return this.head === null;

			}

		} );

	/**
	 * @author Mugen87 / https://github.com/Mugen87
	 */



		// ConvexGeometry

		function ConvexGeometry( points ) {

			Geometry.call( this );

			this.type = 'ConvexGeometry';

			this.fromBufferGeometry( new ConvexBufferGeometry( points ) );
			this.mergeVertices();

		}

		ConvexGeometry.prototype = Object.create( Geometry.prototype );
		ConvexGeometry.prototype.constructor = ConvexGeometry;

		// ConvexBufferGeometry

		function ConvexBufferGeometry( points ) {

		  BufferGeometry.call( this );

			this.type = 'ConvexBufferGeometry';

		  // buffers

		  var vertices = [];
		  var normals = [];

		  // execute QuickHull

			if ( QuickHull === undefined ) {

				console.error( 'ConvexBufferGeometry: ConvexBufferGeometry relies on QuickHull' );

			}

		  var quickHull = new QuickHull().setFromPoints( points );

		  // generate vertices and normals

		  var faces = quickHull.faces;

		  for ( var i = 0; i < faces.length; i ++ ) {

		    var face = faces[ i ];
		    var edge = face.edge;

		    // we move along a doubly-connected edge list to access all face points (see HalfEdge docs)

		    do {

		      var point = edge.head().point;

		      vertices.push( point.x, point.y, point.z );
		      normals.push( face.normal.x, face.normal.y, face.normal.z );

		      edge = edge.next;

		    } while ( edge !== face.edge );

		  }

		  // build geometry

		  this.addAttribute( 'position', new Float32BufferAttribute( vertices, 3 ) );
		  this.addAttribute( 'normal', new Float32BufferAttribute( normals, 3 ) );

		}

		ConvexBufferGeometry.prototype = Object.create( BufferGeometry.prototype );
		ConvexBufferGeometry.prototype.constructor = ConvexBufferGeometry;

	exports.ConvexGeometry = ConvexGeometry;
	exports.ConvexBufferGeometry = ConvexBufferGeometry;

	return exports;

}({}));
