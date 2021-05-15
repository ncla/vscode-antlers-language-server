import { CompletionItemKind } from 'vscode-languageserver';
import { CompletionItem } from 'vscode-languageserver-types';
import { parameterError } from '../../../diagnostics/utils';
import { ISuggestionRequest } from '../../../suggestions/suggestionManager';
import { Scope } from '../../scope/engine';
import { EmptyCompletionResult, exclusiveResult, exclusiveResultList, IAntlersParameter, IAntlersTag, ICompletionResult, IParameterAttribute } from '../../tagManager';
import { IReportableError, ISymbol } from '../../types';
import { makeGlideVariables } from '../../variables/glideVariables';

const GlideCompletionItems: CompletionItem[] = [
	{ label: 'batch', kind: CompletionItemKind.Text },
	{ label: 'generate', kind: CompletionItemKind.Text },
];

const GlideFilters: string[] = [
	'greyscale',
	'sepia'
];

const GlideFormats: string[] = [
	'jpg', 'pjpg', 'png', 'gif',
	'webp', 'tif', 'bmp', 'psd'
];

const GlideOrients: string[] = [
	'auto', '0', '90', '180', '270'
];

export function resolveGlideParameterCompletions(parameter: IAntlersParameter, params: ISuggestionRequest): ICompletionResult {
	if (parameter.name == 'orient') {
		return exclusiveResultList(GlideOrients);
	} else if (parameter.name == 'format') {
		return exclusiveResultList(GlideFormats);
	} else if (parameter.name == 'filter') {
		return exclusiveResultList(GlideFilters);
	} else if (parameter.name == 'preset') {
		return exclusiveResultList(params.project.getAssetPresets());
	}

	return EmptyCompletionResult;
}

const GlideParameters: IAntlersParameter[] = [
	{
		isRequired: false,
		name: 'src',
		aliases: ['path', 'id'],
		acceptsVariableInterpolation: false,
		allowsVariableReference: false,
		description: 'The URL of the image when not using shorthand syntax',
		expectsTypes: ['string'],
		isDynamic: false,
	},
	{
		isRequired: false,
		name: 'tag',
		aliases: [],
		acceptsVariableInterpolation: false,
		allowsVariableReference: false,
		description: 'Outputs an image tag when set to true',
		expectsTypes: ['boolean'],
		isDynamic: false
	},
	{
		isRequired: false,
		name: 'alt',
		description: 'The alt attribute value to use when generating tags',
		acceptsVariableInterpolation: false,
		aliases: [],
		allowsVariableReference: false,
		expectsTypes: ['string'],
		isDynamic: false
	},
	{
		isRequired: false,
		name: 'absolute',
		description: 'Whether to output full URLs',
		acceptsVariableInterpolation: false,
		aliases: [],
		allowsVariableReference: false,
		expectsTypes: ['boolean'],
		isDynamic: false
	},

	{
		name: 'width',
		expectsTypes: ['number'],
		isRequired: false,
		acceptsVariableInterpolation: false,
		aliases: [],
		allowsVariableReference: false,
		description: 'The width of the image, in pixels',
		isDynamic: false,
	},
	{
		name: 'height',
		acceptsVariableInterpolation: false,
		allowsVariableReference: false,
		aliases: [],
		description: 'The height of the image, in pixels',
		expectsTypes: ['number'],
		isDynamic: false,
		isRequired: false,
	},
	{
		name: 'square',
		expectsTypes: ['number'],
		acceptsVariableInterpolation: false,
		aliases: [],
		allowsVariableReference: false,
		description: 'Sets both then height and width of the iamge',
		isDynamic: false,
		isRequired: false
	},
	{
		name: 'fit',
		expectsTypes: ['string'],
		acceptsVariableInterpolation: false,
		aliases: [],
		allowsVariableReference: false,
		description: 'How the image is fitted to its target dimensions',
		isDynamic: false,
		isRequired: false
	},
	{
		name: 'crop',
		acceptsVariableInterpolation: false,
		aliases: [],
		allowsVariableReference: false,
		description: 'Crops the image to the specific dimensions',
		expectsTypes: ['string'],
		isDynamic: false,
		isRequired: false
	},
	{
		name: 'orient',
		acceptsVariableInterpolation: false,
		aliases: [],
		allowsVariableReference: false,
		description: 'Rotates the image',
		expectsTypes: ['*'],
		isDynamic: false,
		isRequired: false,
		validate: (symbol: ISymbol, parameter: IParameterAttribute) => {
			const issues: IReportableError[] = [];

			if (parameter.value.trim().length > 0 && !GlideOrients.includes(parameter.value)) {
				issues.push(parameterError('Invalid orient value', symbol, parameter));
			}

			return issues;
		}
	},
	{
		name: 'quality',
		acceptsVariableInterpolation: false,
		aliases: [],
		allowsVariableReference: false,
		description: 'Defines the quality of the image',
		expectsTypes: ['number'],
		isDynamic: false,
		isRequired: false
	},
	{
		name: 'dpr',
		allowsVariableReference: false,
		acceptsVariableInterpolation: false,
		aliases: [],
		description: 'Defines the device pixel ratio',
		expectsTypes: ['number'],
		isDynamic: false,
		isRequired: false,
		validate: (symbol: ISymbol, parameter: IParameterAttribute) => {
			const intVal = parseInt(parameter.value),
				issues: IReportableError[] = [];

			if (intVal < 1 || intVal > 8) {
				issues.push(parameterError('dpr must be an integer between 1 and 8.', symbol, parameter));
			}

			return issues;
		}
	},
	{
		name: 'format',
		acceptsVariableInterpolation: false,
		aliases: [],
		allowsVariableReference: false,
		description: 'Encodes the image to a specific format',
		expectsTypes: ['string'],
		isDynamic: false,
		isRequired: false,
		validate: (symbol: ISymbol, parameter: IParameterAttribute) => {
			const issues: IReportableError[] = [];

			if (parameter.value.trim().length > 0 && !GlideFormats.includes(parameter.value)) {
				issues.push(parameterError('Format must be one of: ' + GlideFormats.join(','), symbol, parameter));
			}

			return issues;
		}
	},
	{
		name: 'bg',
		description: 'Sets the background color for transparent images',
		acceptsVariableInterpolation: false,
		aliases: [],
		allowsVariableReference: false,
		expectsTypes: ['string'],
		isDynamic: false,
		isRequired: false
	},
	{
		name: 'blur',
		description: 'Adds a blur effect to the image',
		acceptsVariableInterpolation: false,
		aliases: [],
		allowsVariableReference: false,
		expectsTypes: ['string'],
		isDynamic: false,
		isRequired: false,
		validate: (symbol: ISymbol, parameter: IParameterAttribute) => {
			const intVal = parseInt(parameter.value),
				issues: IReportableError[] = [];

			if (intVal < 0 || intVal > 100) {
				issues.push(parameterError('blur must be a value between 0 and 100.', symbol, parameter));
			}

			return issues;
		}
	},
	{
		name: 'brightness',
		description: 'Adjusts the image brightness',
		acceptsVariableInterpolation: false,
		aliases: [],
		allowsVariableReference: false,
		expectsTypes: ['string'],
		isDynamic: false,
		isRequired: false,
		validate: (symbol: ISymbol, parameter: IParameterAttribute) => {
			const intVal = parseInt(parameter.value),
				issues: IReportableError[] = [];

			if (intVal < -100 || intVal > 100) {
				issues.push(parameterError('brightness must be a value between -100 and 100.', symbol, parameter));
			}

			return issues;
		}
	},
	{
		name: 'contrast',
		description: 'Adjusts the image contrast',
		acceptsVariableInterpolation: false,
		aliases: [],
		allowsVariableReference: false,
		expectsTypes: ['string'],
		isDynamic: false,
		isRequired: false,
		validate: (symbol: ISymbol, parameter: IParameterAttribute) => {
			const intVal = parseInt(parameter.value),
				issues: IReportableError[] = [];

			if (intVal < -100 || intVal > 100) {
				issues.push(parameterError('contrast must be a value between -100 and 100.', symbol, parameter));
			}

			return issues;
		}
	},
	{
		name: 'gamma',
		description: 'Adjusts the image gamma',
		acceptsVariableInterpolation: false,
		aliases: [],
		allowsVariableReference: false,
		expectsTypes: ['number'],
		isDynamic: false,
		isRequired: false,
		validate: (symbol: ISymbol, parameter: IParameterAttribute) => {
			const floatVal = parseFloat(parameter.value),
				issues: IReportableError[] = [];

			if (floatVal < 0.1 || floatVal > 9.99) {
				issues.push(parameterError('gamma must be a value between 0.1 and 9.99.', symbol, parameter));
			}

			return issues;
		}
	},
	{
		name: 'sharpen',
		description: 'Sharpens the iamge',
		acceptsVariableInterpolation: false,
		aliases: [],
		allowsVariableReference: false,
		expectsTypes: ['number'],
		isDynamic: false,
		isRequired: false,
		validate: (symbol: ISymbol, parameter: IParameterAttribute) => {
			const intVal = parseInt(parameter.value),
				issues: IReportableError[] = [];

			if (intVal < 0 || intVal > 100) {
				issues.push(parameterError('sharpen must be a value between 0 and 100.', symbol, parameter));
			}

			return issues;
		}
	},
	{
		name: 'pixelate',
		description: 'Applies a pixelation effect to the image',
		acceptsVariableInterpolation: false,
		aliases: [],
		allowsVariableReference: false,
		expectsTypes: ['number'],
		isDynamic: false,
		isRequired: false,
		validate: (symbol: ISymbol, parameter: IParameterAttribute) => {
			const intVal = parseInt(parameter.value),
				issues: IReportableError[] = [];

			if (intVal < 0 || intVal > 100) {
				issues.push(parameterError('pixelate must be a value between 0 and 100.', symbol, parameter));
			}

			return issues;
		}
	},
	{
		name: 'filter',
		description: 'Applies a filter effect to the image',
		acceptsVariableInterpolation: false,
		aliases: [],
		allowsVariableReference: false,
		expectsTypes: ['string'],
		isDynamic: false,
		isRequired: false,
		validate: (symbol: ISymbol, parameter: IParameterAttribute) => {
			const issues: IReportableError[] = [];

			if (parameter.value.trim().length > 0 && !GlideFilters.includes(parameter.value)) {
				issues.push(parameterError('Filter must be one of: ' + GlideFilters.join(','), symbol, parameter));
			}

			return issues;
		}
	},
	{
		name: 'preset',
		acceptsVariableInterpolation: false,
		aliases: [],
		allowsVariableReference: true,
		expectsTypes: ['string'],
		description: 'A collection of pre-configured image manipulation parameters.',
		isDynamic: false,
		isRequired: false
	}
];

export { GlideParameters };

const Glide: IAntlersTag = {
	tagName: 'glide',
	hideFromCompletions: false,
	allowsArbitraryParameters: false,
	allowsContentClose: false,
	injectParentScope: false,
	requiresClose: false,
	parameters: GlideParameters,
	augmentScope: (symbol: ISymbol, scope: Scope) => {
		scope.addVariables(makeGlideVariables(symbol));

		return scope;
	},
	resovleParameterCompletionItems: resolveGlideParameterCompletions,
	resolveCompletionItems: (params: ISuggestionRequest): ICompletionResult => {
		if (params.isPastTagPart == false && (params.leftWord == 'glide' || params.leftWord == '/glide') && params.leftChar == ':') {
			return exclusiveResult(GlideCompletionItems);
		}

		return EmptyCompletionResult;
	}
};

export default Glide;
