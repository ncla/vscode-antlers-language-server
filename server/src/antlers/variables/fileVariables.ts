import { IScopeVariable } from '../scope/engine';
import { ISymbol } from '../types';

export function makeFileVariables(symbol: ISymbol): IScopeVariable[] {
	return [
		{ name: 'basename', dataType: 'string', sourceName: '*internal.file', sourceField: null, introducedBy: symbol },
		{ name: 'extension', dataType: 'string', sourceName: '*internal.file', sourceField: null, introducedBy: symbol },
		{ name: 'filename', dataType: 'string', sourceName: '*internal.file', sourceField: null, introducedBy: symbol },
		{ name: 'is_image', dataType: 'boolean', sourceName: '*internal.file', sourceField: null, introducedBy: symbol },
		{ name: 'file', dataType: 'string', sourceName: '*internal.file', sourceField: null, introducedBy: symbol },
		{ name: 'file', dataType: 'last_modified', sourceName: '*internal.file', sourceField: null, introducedBy: symbol },

		{ name: 'size', dataType: 'string', sourceName: '*internal.file', sourceField: null, introducedBy: symbol },
		{ name: 'size_bytes', dataType: 'number', sourceName: '*internal.file', sourceField: null, introducedBy: symbol },
		{ name: 'size_b', dataType: 'number', sourceName: '*internal.file', sourceField: null, introducedBy: symbol },

		{ name: 'size_gigabytes', dataType: 'number', sourceName: '*internal.file', sourceField: null, introducedBy: symbol },
		{ name: 'size_gb', dataType: 'number', sourceName: '*internal.file', sourceField: null, introducedBy: symbol },

		{ name: 'size_kilobytes', dataType: 'number', sourceName: '*internal.file', sourceField: null, introducedBy: symbol },
		{ name: 'size_kb', dataType: 'number', sourceName: '*internal.file', sourceField: null, introducedBy: symbol },

		{ name: 'size_megabytes', dataType: 'number', sourceName: '*internal.file', sourceField: null, introducedBy: symbol },
		{ name: 'size_mb', dataType: 'number', sourceName: '*internal.file', sourceField: null, introducedBy: symbol },
	];
}
