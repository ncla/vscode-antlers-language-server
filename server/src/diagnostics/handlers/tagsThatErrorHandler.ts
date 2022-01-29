import { AntlersError } from '../../runtime/errors/antlersError';
import { AntlersErrorCodes } from '../../runtime/errors/antlersErrorCodes';
import { AntlersNode } from '../../runtime/nodes/abstractNode';
import { IDiagnosticsHandler } from '../diagnosticsHandler';

const TagsThatErrorHandler: IDiagnosticsHandler = {
    checkNode(node: AntlersNode) {
        const errors: AntlersError[] = [];

        if (node.isTagNode) {
            if (node.getTagName() == 'set') {
                errors.push(AntlersError.makeSyntaxError(
                    AntlersErrorCodes.LINT_SET_PRODUCES_RUNTIME_ERROR,
                    node,
                    '`set` tag will produce "array_merge(): Expected parameter 1 to be an array, object given" runtime exception.'
                ));
            }
        }

        return errors;
    }
};

export default TagsThatErrorHandler;
