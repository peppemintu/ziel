// Build the nested structure for table display
export const buildNestedStructure = (elements, relationships) => {
  // Create a map of element IDs to elements for quick lookup
  const elementMap = new Map(elements.map(el => [el.id, { ...el, children: [] }]));

  // Filter out unwanted relationship types
  const filteredRelationships = relationships.filter(rel => {
    const sourceElement = elementMap.get(rel.sourceElementId);
    const targetElement = elementMap.get(rel.targetElementId);

    // Skip if either element doesn't exist
    if (!sourceElement || !targetElement) return false;

    // Skip lecture-to-lecture relationships
    if (sourceElement.elementType === 'LECTURE' && targetElement.elementType === 'LECTURE') {
      return false;
    }

    // Skip lecture-to-attestation relationships
    if (sourceElement.elementType === 'LECTURE' && targetElement.elementType === 'ATTESTATION') {
      return false;
    }

    return true;
  });

  // Create a map of child to parent relationships using filtered relationships
  const childToParent = new Map();
  filteredRelationships.forEach(rel => {
    childToParent.set(rel.targetElementId, rel.sourceElementId);
  });

  // Build the hierarchy
  const rootElements = [];

  elementMap.forEach((element, elementId) => {
    const parentId = childToParent.get(elementId);

    if (parentId && elementMap.has(parentId)) {
      // This element has a parent
      const parent = elementMap.get(parentId);
      parent.children.push(element);
      element.level = (parent.level || 0) + 1;
    } else {
      // This is a root element
      element.level = 0;
      rootElements.push(element);
    }
  });

  // Flatten the tree into a display order
  const flattenTree = (nodes, result = []) => {
    nodes.forEach(node => {
      result.push(node);
      if (node.children && node.children.length > 0) {
        // Sort children by some criteria (e.g., hours, type, or creation order)
        const sortedChildren = [...node.children].sort((a, b) => {
          // You can customize this sorting logic
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

  // Sort root elements
  const sortedRoots = rootElements.sort((a, b) => {
    if (a.elementType !== b.elementType) {
      const typeOrder = { 'LECTURE': 1, 'PRACTICE': 2, 'LABWORK': 3, 'ATTESTATION': 4 };
      return (typeOrder[a.elementType] || 5) - (typeOrder[b.elementType] || 5);
    }
    return a.hours - b.hours;
  });

  return flattenTree(sortedRoots);
};

// Helper function to check if element has descendant of specific type
export const hasDescendantOfType = (element, type) => {
  if (!element.children) return false;
  return element.children.some(child =>
    child.elementType === type || hasDescendantOfType(child, type)
  );
};