add column 'node_address' to table 'nodes' of type character verying.
This column has value such as '1.12.6.4.11'.
This value calculated as:
1)node with parent_node == null (root node) has node_address == 0;
2)if node_address of parent node == 0 then: (node_position of current node) + 1;
3)else: node_address of parent node + '.' + (node_position of current node) + 1.

Modify project in order to save node_address, update it, and get for api responsies.
