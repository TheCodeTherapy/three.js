import { Line } from './Line.js';
import { Vector3 } from '../math/Vector3.js';
import { Float32BufferAttribute } from '../core/BufferAttribute.js';

const _start = /*@__PURE__*/ new Vector3();
const _end = /*@__PURE__*/ new Vector3();

class LineSegments extends Line {

	constructor( geometry, material ) {

		super( geometry, material );

		this.type = 'LineSegments';

	}

	computeLineDistances() {

		const geometry = this.geometry;

		if ( geometry.isBufferGeometry ) {

			// we assume non-indexed geometry

			if ( geometry.index === null ) {

				const positionAttribute = geometry.attributes.position;
				const lineDistances = [];

				for ( let i = 0, l = positionAttribute.count; i < l; i += 2 ) {

					_start.fromBufferAttribute( positionAttribute, i );
					_end.fromBufferAttribute( positionAttribute, i + 1 );

					lineDistances[ i ] = ( i === 0 ) ? 0 : lineDistances[ i - 1 ];
					lineDistances[ i + 1 ] = lineDistances[ i ] + _start.distanceTo( _end );

				}

				geometry.setAttribute( 'lineDistance', new Float32BufferAttribute( lineDistances, 1 ) );

			} else {

				console.warn( 'LineSegments.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.' );

			}

		} else if ( geometry.isGeometry ) {

			console.error( 'LineSegments.computeLineDistances() no longer supports Geometry. Use BufferGeometry instead.' );

		}

		return this;

	}

}

LineSegments.prototype.isLineSegments = true;

export { LineSegments };
