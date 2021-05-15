import { IModifier } from '../modifierManager';

const assetModifiers: IModifier[] = [
	{
		name: 'background_position',
		acceptsType: ['string'],
		returnsType: ['string'],
		description: 'Converts an asset focal point into a background-position CSS property.',
		docLink: 'https://statamic.dev/modifiers/background_position',
		parameters: [],
		canBeParameter: false
	},
	{
		name: 'image',
		acceptsType: ['string'],
		returnsType: ['string'],
		description: 'Generates an HTML image element with the variable\'s value as the src.',
		docLink: 'https://statamic.dev/modifiers/image',
		parameters: [],
		canBeParameter: false
	},
	{
		name: 'output',
		acceptsType: ['string'],
		returnsType: ['string'],
		description: 'Returns the string output of an Asset file\'s contents.',
		docLink: 'https://statamic.dev/modifiers/output',
		parameters: [],
		canBeParameter: false
	},
];

export { assetModifiers };
