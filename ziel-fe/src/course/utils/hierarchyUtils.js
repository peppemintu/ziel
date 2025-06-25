// Build the nested structure for table display
export const buildNestedStructure = (elements, relationships) => {
  const elementMap = new Map(elements.map(el => [el.id, { ...el, children: [] }]));

  const filteredRelationships = relationships.filter(rel => {
    const sourceElement = elementMap.get(rel.sourceElementId);
    const targetElement = elementMap.get(rel.targetElementId);

    if (!sourceElement || !targetElement) return false;

    if (sourceElement.elementType === 'LECTURE' && targetElement.elementType === 'LECTURE') {
      return false;
    }

    if (sourceElement.elementType === 'LECTURE' && targetElement.elementType === 'ATTESTATION') {
      return false;
    }

    return true;
  });

  const childToParent = new Map();
  filteredRelationships.forEach(rel => {
    childToParent.set(rel.targetElementId, rel.sourceElementId);
  });

  const rootElements = [];

  elementMap.forEach((element, elementId) => {
    const parentId = childToParent.get(elementId);

    if (parentId && elementMap.has(parentId)) {
      const parent = elementMap.get(parentId);
      parent.children.push(element);
      element.level = (parent.level || 0) + 1;
    } else {
      element.level = 0;
      rootElements.push(element);
    }
  });

  const flattenTree = (nodes, result = []) => {
    nodes.forEach(node => {
      result.push(node);
      if (node.children && node.children.length > 0) {
        const sortedChildren = [...node.children].sort((a, b) => {
          if (a.elementType !== b.elementType) {
            const typeOrder = { 'LECTURE': 1, 'PRACTICE': 2, 'LABWORK': 3, 'ATTESTATION': 4 };
            return (typeOrder[a.elementType] || 5) - (typeOrder[b.elementType] || 5);
          }
          return a.hours - b.hours;
        });
        flattenTree(sortedChildren, result);
      }
    });
    return result;
  };

  const sortedRoots = rootElements.sort((a, b) => {
    if (a.elementType !== b.elementType) {
      const typeOrder = { 'LECTURE': 1, 'PRACTICE': 2, 'LABWORK': 3, 'ATTESTATION': 4 };
      return (typeOrder[a.elementType] || 5) - (typeOrder[b.elementType] || 5);
    }
    return a.hours - b.hours;
  });

  return flattenTree(sortedRoots);
};

export const hasDescendantOfType = (element, type) => {
  if (!element.children) return false;
  return element.children.some(child =>
    child.elementType === type || hasDescendantOfType(child, type)
  );
};