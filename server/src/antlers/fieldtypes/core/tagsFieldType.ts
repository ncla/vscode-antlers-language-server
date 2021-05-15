import { Scope } from '../../scope/engine';
import { ISymbol } from '../../types';
import { makeArrayVariables } from '../../variables/arrayVariables';
import { makeLoopVariables } from '../../variables/loopVariables';
import { IFieldtypeInjection } from '../fieldtypeManager';

const TagsFieldtype: IFieldtypeInjection = {
	name: 'tags',
	augmentScope: (symbol: ISymbol, scope: Scope) => {
		scope.addVariables(makeArrayVariables(symbol));
		scope.addVariables(makeLoopVariables(symbol));
	}
};

export default TagsFieldtype;
