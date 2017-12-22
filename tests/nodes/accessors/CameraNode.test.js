var Three = (function (exports) {
	'use strict';

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
	 * @author sunag / http://www.sunag.com.br/
	 */

	var GLNode = function( type ) {

		this.uuid = _Math.generateUUID();

		this.allows = {};
		this.requestUpdate = false;

		this.type = type;

	};

	GLNode.prototype.parse = function( builder, context ) {

		context = context || {};

		builder.parsing = true;

		var material = builder.material;

		this.build( builder.addCache( context.cache, context.requires ).addSlot( context.slot ), 'v4' );

		material.clearVertexNode();
		material.clearFragmentNode();

		builder.removeCache().removeSlot();

		builder.parsing = false;

	};

	GLNode.prototype.parseAndBuildCode = function( builder, output, context ) {

		context = context || {};

		this.parse( builder, context );

		return this.buildCode( builder, output, context );

	};

	GLNode.prototype.buildCode = function( builder, output, context ) {

		context = context || {};

		var material = builder.material;

		var data = { result : this.build( builder.addCache( context.cache, context.requires ).addSlot( context.slot ), output ) };

		if ( builder.isShader( 'vertex' ) ) data.code = material.clearVertexNode();
		else data.code = material.clearFragmentNode();

		builder.removeCache().removeSlot();

		return data;

	};

	GLNode.prototype.build = function( builder, output, uuid ) {

		output = output || this.getType( builder, output );

		var material = builder.material, data = material.getDataNode( uuid || this.uuid );

		if ( builder.parsing ) this.appendDepsNode( builder, data, output );

		if ( this.allows[ builder.shader ] === false ) {

			throw new Error( 'Shader ' + shader + ' is not compatible with this node.' );

		}

		if ( this.requestUpdate && material.requestUpdate.indexOf( this ) === - 1 ) {

			material.requestUpdate.push( this );

		}

		return this.generate( builder, output, uuid );

	};

	GLNode.prototype.appendDepsNode = function( builder, data, output ) {

		data.deps = ( data.deps || 0 ) + 1;

		var outputLen = builder.getFormatLength( output );

		if ( outputLen > ( data.outputMax || 0 ) || this.getType( builder, output ) ) {

			data.outputMax = outputLen;
			data.output = output;

		}

	};

	GLNode.prototype.getType = function( builder, output ) {

		return output === 'sampler2D' || output === 'samplerCube' ? output : this.type;

	};

	/**
	 * Automatic node cache
	 * @author sunag / http://www.sunag.com.br/
	 */

	var TempNode = function( type, params ) {

		GLNode.call( this, type );

		params = params || {};

		this.shared = params.shared !== undefined ? params.shared : true;
		this.unique = params.unique !== undefined ? params.unique : false;

	};

	TempNode.prototype = Object.create( GLNode.prototype );
	TempNode.prototype.constructor = TempNode;

	TempNode.prototype.build = function( builder, output, uuid, ns ) {

		output = output || this.getType( builder );

		var material = builder.material;

		if ( this.isShared( builder, output ) ) {

			var isUnique = this.isUnique( builder, output );

			if ( isUnique && this.constructor.uuid === undefined ) {

				this.constructor.uuid = Math.generateUUID();

			}

			uuid = builder.getUuid( uuid || this.getUuid(), ! isUnique );

			var data = material.getDataNode( uuid );

			if ( builder.parsing ) {

				if ( data.deps || 0 > 0 ) {

					this.appendDepsNode( builder, data, output );

					return this.generate( builder, type, uuid );

				}

				return GLNode.prototype.build.call( this, builder, output, uuid );

			} else if ( isUnique ) {

				data.name = data.name || GLNode.prototype.build.call( this, builder, output, uuid );

				return data.name;

			} else if ( ! builder.optimize || data.deps == 1 ) {

				return GLNode.prototype.build.call( this, builder, output, uuid );

			}

			uuid = this.getUuid( false );

			var name = this.getTemp( builder, uuid );
			var type = data.output || this.getType( builder );

			if ( name ) {

				return builder.format( name, type, output );

			} else {

				name = TempNode.prototype.generate.call( this, builder, output, uuid, data.output, ns );

				var code = this.generate( builder, type, uuid );

				if ( builder.isShader( 'vertex' ) ) material.addVertexNode( name + '=' + code + ';' );
				else material.addFragmentNode( name + '=' + code + ';' );

				return builder.format( name, type, output );

			}

		}

		return GLNode.prototype.build.call( this, builder, output, uuid );

	};

	TempNode.prototype.isShared = function( builder, output ) {

		return output !== 'sampler2D' && output !== 'samplerCube' && this.shared;

	};

	TempNode.prototype.isUnique = function( builder, output ) {

		return this.unique;

	};

	TempNode.prototype.getUuid = function( unique ) {

		var uuid = unique || unique == undefined ? this.constructor.uuid || this.uuid : this.uuid;

		if ( typeof this.scope == "string" ) uuid = this.scope + '-' + uuid;

		return uuid;

	};

	TempNode.prototype.getTemp = function( builder, uuid ) {

		uuid = uuid || this.uuid;

		var material = builder.material;

		if ( builder.isShader( 'vertex' ) && material.vertexTemps[ uuid ] ) return material.vertexTemps[ uuid ].name;
		else if ( material.fragmentTemps[ uuid ] ) return material.fragmentTemps[ uuid ].name;

	};

	TempNode.prototype.generate = function( builder, output, uuid, type, ns ) {

		if ( ! this.isShared( builder, output ) ) console.error( "TempNode is not shared!" );

		uuid = uuid || this.uuid;

		if ( builder.isShader( 'vertex' ) ) return builder.material.getVertexTemp( uuid, type || this.getType( builder ), ns ).name;
		else return builder.material.getFragmentTemp( uuid, type || this.getType( builder ), ns ).name;

	};

	/**
	 * @author sunag / http://www.sunag.com.br/
	 * @thanks bhouston / https://clara.io/
	 */

	var FunctionNode = function( src, includesOrType, extensionsOrIncludes, keywordsOrExtensions ) {

		src = src || '';

		this.isMethod = typeof includesOrType !== "string";
		this.useKeywords = true;

		TempNode.call( this, this.isMethod ? null : includesOrType );

		if ( this.isMethod ) this.eval( src, includesOrType, extensionsOrIncludes, keywordsOrExtensions );
		else this.eval( src, extensionsOrIncludes, keywordsOrExtensions );

	};

	FunctionNode.rDeclaration = /^([a-z_0-9]+)\s([a-z_0-9]+)\s?\((.*?)\)/i;
	FunctionNode.rProperties = /[a-z_0-9]+/ig;

	FunctionNode.prototype = Object.create( TempNode.prototype );
	FunctionNode.prototype.constructor = FunctionNode;

	FunctionNode.prototype.isShared = function( builder, output ) {

		return ! this.isMethod;

	};

	FunctionNode.prototype.getType = function( builder ) {

		return builder.getTypeByFormat( this.type );

	};

	FunctionNode.prototype.getInputByName = function( name ) {

		var i = this.inputs.length;

		while ( i -- ) {

			if ( this.inputs[ i ].name === name )
				return this.inputs[ i ];

		}

	};

	FunctionNode.prototype.getIncludeByName = function( name ) {

		var i = this.includes.length;

		while ( i -- ) {

			if ( this.includes[ i ].name === name )
				return this.includes[ i ];

		}

	};

	FunctionNode.prototype.generate = function( builder, output ) {

		var match, offset = 0, src = this.value;

		for ( var i = 0; i < this.includes.length; i ++ ) {

			builder.include( this.includes[ i ], this );

		}

		for ( var ext in this.extensions ) {

			builder.material.extensions[ ext ] = true;

		}

		while ( match = FunctionNode.rProperties.exec( this.value ) ) {

			var prop = match[ 0 ], isGlobal = this.isMethod ? ! this.getInputByName( prop ) : true;
			var reference = prop;

			if ( this.keywords[ prop ] || ( this.useKeywords && isGlobal && NodeLib.containsKeyword( prop ) ) ) {

				var node = this.keywords[ prop ];

				if ( ! node ) {

					var keyword = NodeLib.getKeywordData( prop );

					if ( keyword.cache ) node = builder.keywords[ prop ];

					node = node || NodeLib.getKeyword( prop, builder );

					if ( keyword.cache ) builder.keywords[ prop ] = node;

				}

				reference = node.build( builder );

			}

			if ( prop != reference ) {

				src = src.substring( 0, match.index + offset ) + reference + src.substring( match.index + prop.length + offset );

				offset += reference.length - prop.length;

			}

			if ( this.getIncludeByName( reference ) === undefined && NodeLib.contains( reference ) ) {

				builder.include( NodeLib.get( reference ) );

			}

		}

		if ( output === 'source' ) {

			return src;

		} else if ( this.isMethod ) {

			builder.include( this, false, src );

			return this.name;

		} else {

			return builder.format( "(" + src + ")", this.getType( builder ), output );

		}

	};

	FunctionNode.prototype.eval = function( src, includes, extensions, keywords ) {

		src = ( src || '' ).trim();

		this.includes = includes || [];
		this.extensions = extensions || {};
		this.keywords = keywords || {};

		if ( this.isMethod ) {

			var match = src.match( FunctionNode.rDeclaration );

			this.inputs = [];

			if ( match && match.length == 4 ) {

				this.type = match[ 1 ];
				this.name = match[ 2 ];

				var inputs = match[ 3 ].match( FunctionNode.rProperties );

				if ( inputs ) {

					var i = 0;

					while ( i < inputs.length ) {

						var qualifier = inputs[ i ++ ];
						var type, name;

						if ( qualifier == 'in' || qualifier == 'out' || qualifier == 'inout' ) {

							type = inputs[ i ++ ];

						} else {

							type = qualifier;
							qualifier = '';

						}

						name = inputs[ i ++ ];

						this.inputs.push( {
							name : name,
							type : type,
							qualifier : qualifier
						} );

					}

				}

			} else {

				this.type = '';
				this.name = '';

			}

		}

		this.value = src;

	};

	/**
	 * @author sunag / http://www.sunag.com.br/
	 */

	var InputNode = function( type, params ) {

		params = params || {};
		params.shared = params.shared !== undefined ? params.shared : false;

		TempNode.call( this, type, params );

	};

	InputNode.prototype = Object.create( TempNode.prototype );
	InputNode.prototype.constructor = InputNode;

	InputNode.prototype.generate = function( builder, output, uuid, type, ns, needsUpdate ) {

		var material = builder.material;

		uuid = builder.getUuid( uuid || this.getUuid() );
		type = type || this.getType( builder );

		var data = material.getDataNode( uuid );

		if ( builder.isShader( 'vertex' ) ) {

			if ( ! data.vertex ) {

				data.vertex = material.createVertexUniform( type, this.value, ns, needsUpdate );

			}

			return builder.format( data.vertex.name, type, output );

		} else {

			if ( ! data.fragment ) {

				data.fragment = material.createFragmentUniform( type, this.value, ns, needsUpdate );

			}

			return builder.format( data.fragment.name, type, output );

		}

	};

	/**
	 * @author sunag / http://www.sunag.com.br/
	 */

	var FloatNode = function( value ) {

		InputNode.call( this, 'fv1' );

		this.value = [ value || 0 ];

	};

	FloatNode.prototype = Object.create( InputNode.prototype );
	FloatNode.prototype.constructor = FloatNode;

	Object.defineProperties( FloatNode.prototype, {
		number: {
			get: function() {

				return this.value[ 0 ];

			},
			set: function( val ) {

				this.value[ 0 ] = val;

			}
		}
	} );

	/**
	 * @author sunag / http://www.sunag.com.br/
	 */

	var PositionNode = function( scope ) {

		TempNode.call( this, 'v3' );

		this.scope = scope || PositionNode.LOCAL;

	};

	PositionNode.LOCAL = 'local';
	PositionNode.WORLD = 'world';
	PositionNode.VIEW = 'view';
	PositionNode.PROJECTION = 'projection';

	PositionNode.prototype = Object.create( TempNode.prototype );
	PositionNode.prototype.constructor = PositionNode;

	PositionNode.prototype.getType = function( builder ) {

		switch ( this.scope ) {
			case PositionNode.PROJECTION:
				return 'v4';
		}

		return this.type;

	};

	PositionNode.prototype.isShared = function( builder ) {

		switch ( this.scope ) {
			case PositionNode.LOCAL:
			case PositionNode.WORLD:
				return false;
		}

		return true;

	};

	PositionNode.prototype.generate = function( builder, output ) {

		var material = builder.material;
		var result;

		switch ( this.scope ) {

			case PositionNode.LOCAL:

				material.requestAttribs.position = true;

				if ( builder.isShader( 'vertex' ) ) result = 'transformed';
				else result = 'vPosition';

				break;

			case PositionNode.WORLD:

				material.requestAttribs.worldPosition = true;

				if ( builder.isShader( 'vertex' ) ) result = 'vWPosition';
				else result = 'vWPosition';

				break;

			case PositionNode.VIEW:

				if ( builder.isShader( 'vertex' ) ) result = '-mvPosition.xyz';
				else result = 'vViewPosition';

				break;

			case PositionNode.PROJECTION:

				if ( builder.isShader( 'vertex' ) ) result = '(projectionMatrix * modelViewMatrix * vec4( position, 1.0 ))';
				else result = 'vec4( 0.0 )';

				break;

		}

		return builder.format( result, this.getType( builder ), output );

	};

	/**
	 * @author sunag / http://www.sunag.com.br/
	 */

	var CameraNode = function( scope, camera ) {

		TempNode.call( this, 'v3' );

		this.setScope( scope || CameraNode.POSITION );
		this.setCamera( camera );

	};

	CameraNode.fDepthColor = new FunctionNode( [
	"float depthColor( float mNear, float mFar ) {",
	"	#ifdef USE_LOGDEPTHBUF_EXT",
	"		float depth = gl_FragDepthEXT / gl_FragCoord.w;",
	"	#else",
	"		float depth = gl_FragCoord.z / gl_FragCoord.w;",
	"	#endif",
	"	return 1.0 - smoothstep( mNear, mFar, depth );",
	"}"
	].join( "\n" ) );

	CameraNode.POSITION = 'position';
	CameraNode.DEPTH = 'depth';
	CameraNode.TO_VERTEX = 'toVertex';

	CameraNode.prototype = Object.create( TempNode.prototype );
	CameraNode.prototype.constructor = CameraNode;

	CameraNode.prototype.setCamera = function( camera ) {

		this.camera = camera;
		this.requestUpdate = camera !== undefined;

	};

	CameraNode.prototype.setScope = function( scope ) {

		switch ( this.scope ) {

			case CameraNode.DEPTH:

				delete this.near;
				delete this.far;

				break;

		}

		this.scope = scope;

		switch ( scope ) {

			case CameraNode.DEPTH:

				this.near = new FloatNode( camera ? camera.near : 1 );
				this.far = new FloatNode( camera ? camera.far : 1200 );

				break;

		}

	};

	CameraNode.prototype.getType = function( builder ) {

		switch ( this.scope ) {
			case CameraNode.DEPTH:
				return 'fv1';
		}

		return this.type;

	};

	CameraNode.prototype.isUnique = function( builder ) {

		switch ( this.scope ) {
			case CameraNode.DEPTH:
			case CameraNode.TO_VERTEX:
				return true;
		}

		return false;

	};

	CameraNode.prototype.isShared = function( builder ) {

		switch ( this.scope ) {
			case CameraNode.POSITION:
				return false;
		}

		return true;

	};

	CameraNode.prototype.generate = function( builder, output ) {

		var result;

		switch ( this.scope ) {

			case CameraNode.POSITION:

				result = 'cameraPosition';

				break;

			case CameraNode.DEPTH:

				var func = CameraNode.fDepthColor;

				builder.include( func );

				result = func.name + '(' + this.near.build( builder, 'fv1' ) + ',' + this.far.build( builder, 'fv1' ) + ')';

				break;

			case CameraNode.TO_VERTEX:

				result = 'normalize( ' + new PositionNode( PositionNode.WORLD ).build( builder, 'v3' ) + ' - cameraPosition )';

				break;

		}

		return builder.format( result, this.getType( builder ), output );

	};

	CameraNode.prototype.updateFrame = function( delta ) {

		switch ( this.scope ) {

			case CameraNode.DEPTH:

				this.near.number = camera.near;
				this.far.number = camera.far;

				break;

		}

	};

	exports.CameraNode = CameraNode;

	return exports;

}({}));
