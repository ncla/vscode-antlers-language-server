import { Range } from 'vscode-languageserver-textdocument';
import { CompletionItem, CompletionItemKind, InsertTextFormat, TextEdit } from 'vscode-languageserver-types';
import { IBlueprintField } from '../../../../projects/blueprints/fields';
import { IProjectDetailsProvider } from '../../../../projects/projectDetailsProvider';
import { AntlersNode } from '../../../../runtime/nodes/abstractNode';
import { ISuggestionRequest } from '../../../../suggestions/suggestionRequest';
import { Scope } from '../../../scope/scope';
import { ICollectionContext } from '../../../types';
import { EntryStatuses } from './parameters';

export function getExcludeCollectionName(node: AntlersNode): string | null {
    if (node.isClosedBy) {
        return null;
    }

    const excludeParam = node.findAnyParameter(['not_from', 'not_folder', 'dont_use']);

    if (excludeParam != null) {
        return excludeParam.value;
    }

    return null;
}

export function getTaxonomyCompletionItems(request: ISuggestionRequest): CompletionItem[] {
    const items: CompletionItem[] = [];

    if (request.project != null) {
        const range: Range = {
            start: {
                line: request.position.line,
                character: request.position.character - request.originalLeftWord.length
            },
            end: request.position
        };

        const taxonomyNames = request.project.getUniqueTaxonomyNames();

        for (let i = 0; i < taxonomyNames.length; i++) {
            const taxonomyName = taxonomyNames[i];
            const snippet = request.originalLeftWord + taxonomyName + '="$1"';

            items.push({
                label: request.originalLeftWord + taxonomyName,
                insertTextFormat: InsertTextFormat.Snippet,
                kind: CompletionItemKind.Field,
                textEdit: TextEdit.replace(range, snippet),
                command: {
                    title: 'Suggest',
                    command: 'editor.action.triggerSuggest'
                }
            });
        }
    }

    return items;
}

export function getCollectionBlueprintFields(node: AntlersNode, scope: Scope): IBlueprintField[] {
    let fields: IBlueprintField[] = [];

    if (node.reference != null) {
        const collectionNode = node.reference as ICollectionContext,
            nodeFields = scope.statamicProject.getBlueprintFields(collectionNode.collectionNames);

        if (typeof nodeFields !== 'undefined' && nodeFields != null) {
            fields = nodeFields;
        }
    }

    return fields;
}

export function makeStatusSuggestions(existingValues: string[]): CompletionItem[] {
    const items: CompletionItem[] = [],
        validStatuses = EntryStatuses.filter(e => !existingValues.includes(e));

    for (let i = 0; i < validStatuses.length; i++) {
        items.push({
            label: validStatuses[i],
            kind: CompletionItemKind.Variable
        });
    }

    return items;
}

export function makeTaxonomySuggestions(existingValues: string[], taxonomyName: string, project: IProjectDetailsProvider): CompletionItem[] {
    const items: CompletionItem[] = [],
        taxonomyTerms = project.getTaxonomyTerms(taxonomyName),
        termsToReturn = taxonomyTerms.filter(e => !existingValues.includes(e));

    for (let i = 0; i < termsToReturn.length; i++) {
        items.push({
            label: termsToReturn[i],
            kind: CompletionItemKind.Variable
        });
    }

    return items;
}

export function makeSingleCollectionNameSuggestions(project: IProjectDetailsProvider): CompletionItem[] {
    const items: CompletionItem[] = [],
        collectionNames = project.getCollectionNames();

    for (let i = 0; i < collectionNames.length; i++) {
        items.push({
            label: collectionNames[i],
            kind: CompletionItemKind.Variable
        });
    }

    return items;
}

export function makeCollectionNameSuggestions(existingValues: string[], project: IProjectDetailsProvider): CompletionItem[] {
    const items: CompletionItem[] = [],
        collectionNames = project.getCollectionNames().filter(e => !existingValues.includes(e));

    for (let i = 0; i < collectionNames.length; i++) {
        items.push({
            label: collectionNames[i],
            kind: CompletionItemKind.Variable
        });
    }

    return items;
}

export function makeQueryScopeSuggestions(project: IProjectDetailsProvider): CompletionItem[] {
    const items: CompletionItem[] = [];

    const queryScopes = project.getCollectionQueryScopes();

    for (let i = 0; i < queryScopes.length; i++) {
        items.push({
            label: queryScopes[i].name,
            detail: queryScopes[i].description,
            kind: CompletionItemKind.Variable
        });
    }

    return items;
}
