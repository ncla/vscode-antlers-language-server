import { ISuggestionRequest } from '../../../../suggestions/suggestionManager';
import { exclusiveResultList, IAntlersParameter, IAntlersTag } from '../../../tagManager';
import FormHandleParam from './formHandleParam';
import { HandleParams } from './parameterCompletions';
import { resolveFormSetReference } from './resolveFormSetReference';

const FormErrors: IAntlersTag = {
	tagName: 'form:errors',
	allowsArbitraryParameters: false,
	allowsContentClose: false,
	requiresClose: true,
	hideFromCompletions: false,
	injectParentScope: false,
	parameters: [
		FormHandleParam
	],
	resolveSpecialType: resolveFormSetReference,
	resovleParameterCompletionItems: (parameter: IAntlersParameter, params: ISuggestionRequest) => {
		if (HandleParams.includes(parameter.name)) {
			return exclusiveResultList(params.project.getUniqueFormNames());
		}

		return null;
	}
};

export default FormErrors;
